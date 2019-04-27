import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { addNamed } from '@babel/helper-module-imports';
import { createMacro } from 'babel-plugin-macros';

type Argument = t.Expression | t.SpreadElement | t.JSXNamespacedName | t.ArgumentPlaceholder;

function getInitState(path: NodePath): Argument {
  const callExpression = path.findParent(p => t.isCallExpression(p)) as NodePath<t.CallExpression>;
  return callExpression.node.arguments[0];
}

function stateMacro(path: NodePath) {
  const variableDeclaration = path.findParent(p => t.isVariableDeclaration(p)) as NodePath<t.VariableDeclaration>;
  const id = path.find(p => t.isVariableDeclarator(p)).get('id') as NodePath<t.Identifier>;
  const initState = getInitState(path);
  const hookId = addNamed(path, 'useState', 'react');
  const updater = path.scope.generateUidIdentifier(`set${id.node.name}`);
  variableDeclaration.replaceWith(
    t.variableDeclaration('const', [
      t.variableDeclarator(t.arrayPattern([t.identifier(id.node.name), updater]), t.callExpression(hookId, [initState]))
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
        variable.name == id.node.name
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

function reactive({ references }: any) {
  if (references.state) {
    references.state.forEach(stateMacro);
  }
}

export default createMacro(reactive);
