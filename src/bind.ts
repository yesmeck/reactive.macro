import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { addDefault, addNamed } from '@babel/helper-module-imports';

export default function bind(stateUpdaters: Map<string, t.Identifier>, path: NodePath) {
  const jsxElement = path.findParent(p => t.isJSXOpeningElement(p)) as NodePath<t.JSXOpeningElement>;
  const stateVariable = (path.parentPath.get('arguments') as Array<NodePath>)[0] as NodePath<t.Identifier>;
  const eventVariable = path.scope.generateUidIdentifier('e');
  const updater = stateUpdaters.get(stateVariable.node.name);
  const helperId = addDefault(path, 'reactive.macro/lib/helpers/getValue', {
    nameHint: 'getValue'
  });
  const hookId = addNamed(path, 'useCallback', 'react');
  jsxElement.node.attributes.push(
    t.jsxAttribute(
      t.jsxIdentifier('onChange'),
      t.jsxExpressionContainer(
        t.callExpression(hookId, [
          t.arrowFunctionExpression(
            [eventVariable],
            t.callExpression(updater!, [t.callExpression(helperId, [eventVariable])])
          ),
          t.arrayExpression()
        ])
      )
    )
  );
  path.findParent(p => t.isCallExpression(p)).replaceWith(stateVariable.node);
}
