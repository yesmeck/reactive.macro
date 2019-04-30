<div align="center">
  <img src="https://user-images.githubusercontent.com/465125/56975295-794a4180-6bab-11e9-9df3-8601ce87bb2e.png" alt="reactive.macro logo" />
</div>

<hr />

[![Travis (.org) branch](https://img.shields.io/travis/yesmeck/reactive.macro/master.svg?style=flat-square)](https://travis-ci.org/yesmeck/reactive.macro)

A [babel macro](https://github.com/kentcdodds/babel-plugin-macros) that helps you reduce the React boilerplate.

## Installation

```javascript
$ npm install reactive.macro --save
```

You need [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) before using this package.

If you are using create-react-app, it's already included babel-plugin-macros.

## Usage

```javascript
import React from 'react';
import { state, bind } from 'reactive.macro';

export default () => {
  let a = state(1);
  let b = state(2);

  return (
    <div>
      <input type="number" value={bind(a)} />
      <button onClick={b => b += 1} >b+</button>

      <p>{a} + {b} = {a + b}</p>
    </div>
  );
};
```

See [live demo](https://codesandbox.io/s/k5ryv0z4p7).

Equals:

```javascript
import React, { useState, useCallback } from 'react';

export default () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);

  return (
    <div>
      <input type="number" value={a} onChange={useCallback(e => setA(e.target.value), [])} />
      <button onClick={b => setB(b + 1)} >b+</button>

      <p>{a} + {b} = {a + b}</p>
    </div>
  );
};
```

## API

### `state`

Declare a state.

### Arguments

- `initialState` - Initial value.


### Example

In component:

```javascript
const App = () => {
  let count = state(0);

  return <button onClick={() => count + 1}>Clicked {count} {count > 1 ? 'times' : 'time'}</button>
}
```

In custom hook:

```javascript
const useToggle = () => {
  let visible = state(false);

  const toggle = () => {
    visible = !visible
  }

  return [visible, toggle];
}
```

You can update the value of `count` directly without calling `setState`.

Note: using array methods like `push` and `splice` won't trigger re-render. Instead you can use spread syntax.

```javascript
let users = state([]);

const addUser = (user) => {
  users = [...users, user];
}
```

### `bind`

Bind a state to a form control.

- `state` - The state which is declared bye `state` macro.

### Example

```javascript
const App = () => {
  let name = state('');

  return (
    <div>
      <input value={bind(name)} />
      Hello {name}!
    </div>
  );
}
```

## License

[MIT](LICENSE)
