import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { createMacro } from 'babel-plugin-macros';
import bind from './bind';
import state from './state';

function reactive({ references }: { references: { [name: string]: NodePath[] } }) {
  const stateUpdaters: Map<string, t.Identifier> = new Map();
  if (references.state) {
    references.state.forEach(path => state(stateUpdaters, path));
  }
  if (references.bind) {
    references.bind.forEach(path => bind(stateUpdaters, path));
  }
}

export default createMacro(reactive);
