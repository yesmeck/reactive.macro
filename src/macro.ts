import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { addNamed, addDefault } from '@babel/helper-module-imports';
import { createMacro } from 'babel-plugin-macros';

type Argument = t.Expression | t.SpreadElement | t.JSXNamespacedName | t.ArgumentPlaceholder;

function getInitState(path: NodePath): Argument {
  const callExpression = path.findParent(p => t.isCallExpression(p)) as NodePath<t.CallExpression>;
  return callExpression.node.arguments[0];
}

function getUpdater(path: NodePath<t.Identifier>): t.Identifier | undefined {
  const { bindings } = path.scope;
  for (let key of Object.keys(bindings)) {
    if (key === path.node.name) {
      const binding = bindings[key];
      return (binding.path.node as t.VariableDeclarator).id as t.Identifier;
    }
  }
}

function stateMacro(stateUpdaters: Map<string, t.Identifier>, path: NodePath) {
  const variableDeclaration = path.findParent(p => t.isVariableDeclaration(p)) as NodePath<t.VariableDeclaration>;
  const stateVariable = path.find(p => t.isVariableDeclarator(p)).get('id') as NodePath<t.Identifier>;
  const initState = getInitState(path);
  const hookId = addNamed(path, 'useState', 'react');
  const updater = path.scope.generateUidIdentifier(`set${stateVariable.node.name}`);
  stateUpdaters.set(stateVariable.node.name, updater);
  variableDeclaration.replaceWith(
    t.variableDeclaration('const', [
      t.variableDeclarator(
        t.arrayPattern([t.identifier(stateVariable.node.name), updater]),
        t.callExpression(hookId, [initState])
      )
    ])
  );
  path.replaceWith(initState);
  const functionDeclaration = path.getFunctionParent();
  functionDeclaration.traverse({
    AssignmentExpression(path: NodePath<t.AssignmentExpression>) {
      const variable = path.get('left').node;
      if (
        t.isIdentifier(variable) &&
        functionDeclaration.scope.hasOwnBinding(variable.name) &&
        variable.name == stateVariable.node.name
      ) {
        const stateName = functionDeclaration.scope.generateUidIdentifier(stateVariable.node.name);
        path.get('right').traverse({
          Identifier(p: NodePath<t.Identifier>) {
            if (functionDeclaration.scope.hasOwnBinding(p.node.name) && p.node.name == stateVariable.node.name) {
              p.replaceWith(stateName);
            }
          }
        });
        path.replaceWith(
          t.callExpression(updater, [
            t.arrowFunctionExpression(
              [stateName],
              t.assignmentExpression(path.node.operator, stateName, path.get('right').node)
            )
          ])
        );
      }
    }
  });
}

function bindMacro(stateUpdaters: Map<string, t.Identifier>, path: NodePath) {
  const jsxElement = path.findParent(p => t.isJSXOpeningElement(p)) as NodePath<t.JSXOpeningElement>;
  const stateVariable = (path.parentPath.get('arguments') as Array<NodePath>)[0] as NodePath<t.Identifier>;
  const eventVariable = path.scope.generateUidIdentifier('e');
  const updater = stateUpdaters.get(stateVariable.node.name);
  const helperId = addDefault(path, 'reactive.macro/lib/helpers/getValue', {
    nameHint: 'getValue',
  });
  jsxElement.node.attributes.push(
    t.jsxAttribute(
      t.jsxIdentifier('onChange'),
      t.jsxExpressionContainer(
        t.arrowFunctionExpression(
          [eventVariable],
          t.callExpression(updater!, [
            t.callExpression(
              helperId,
              [eventVariable]
            )
          ])
        )
      )
    )
  );
  path.findParent(p => t.isCallExpression(p)).replaceWith(stateVariable.node);
}

function reactive({ references }: { references: { [name: string]: NodePath[] } }) {
  const stateUpdaters: Map<string, t.Identifier> = new Map;
  if (references.state) {
    references.state.forEach((path) => stateMacro(stateUpdaters, path));
  }
  if (references.bind) {
    references.bind.forEach((path) => bindMacro(stateUpdaters, path));
  }
}

export default createMacro(reactive);
