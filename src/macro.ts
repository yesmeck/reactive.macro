import * as t from '@babel/types';
import { NodePath, Binding } from '@babel/traverse';
import { addNamed } from '@babel/helper-module-imports';
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
      return (((binding.path.node as t.VariableDeclarator).id as t.ArrayPattern).elements as t.Identifier[])[1];
    }
  }
}

function stateMacro(path: NodePath) {
  const variableDeclaration = path.findParent(p => t.isVariableDeclaration(p)) as NodePath<t.VariableDeclaration>;
  const stateVariable = path.find(p => t.isVariableDeclarator(p)).get('id') as NodePath<t.Identifier>;
  const initState = getInitState(path);
  const hookId = addNamed(path, 'useState', 'react');
  const updater = path.scope.generateUidIdentifier(`set${stateVariable.node.name}`);
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
        const stateName = functionDeclaration.scope.generateUidIdentifier('count');
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

function bindMacro(path: NodePath) {
  const jsxElement = path.findParent(p => t.isJSXOpeningElement(p)) as NodePath<t.JSXOpeningElement>;
  const stateVariable = (path.parentPath.get('arguments') as Array<NodePath>)[0] as NodePath<t.Identifier>;
  const updater = getUpdater(stateVariable);
  const eventVariable = path.scope.generateUidIdentifier('e');
  jsxElement.node.attributes.push(
    t.jsxAttribute(
      t.jsxIdentifier('onChange'),
      t.jsxExpressionContainer(
        t.arrowFunctionExpression(
          [eventVariable],
          t.callExpression(updater!, [
            t.memberExpression(t.memberExpression(eventVariable, t.identifier('target')), t.identifier('value'))
          ])
        )
      )
    )
  );
  path.findParent(p => t.isCallExpression(p)).replaceWith(stateVariable.node);
}

function reactive({ references }: { references: { [name: string]: NodePath[] } }) {
  if (references.state) {
    references.state.forEach(stateMacro);
  }
  if (references.bind) {
    references.bind.forEach(bindMacro);
  }
}

export default createMacro(reactive);
