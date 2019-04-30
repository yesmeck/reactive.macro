import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { createMacro } from 'babel-plugin-macros';
import bindMacro from './bind';
import stateMacro from './state';

function reactive({ references }: { references: { [name: string]: NodePath[] } }) {
  const stateUpdaters: Map<string, t.Identifier> = new Map();
  if (references.state) {
    references.state.forEach(path => stateMacro(stateUpdaters, path));
  }
  if (references.bind) {
    references.bind.forEach(path => bindMacro(stateUpdaters, path));
  }
}

export declare function state<T>(initialState: T): T;
export declare function bind<T>(state: T): T;

export default createMacro(reactive);
