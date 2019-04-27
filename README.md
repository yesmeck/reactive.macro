# reactive.macro

A babel macro which allows you to declare a state just like declaring a normal variable, and then update the state like updating a normal variable.

**This project is still an experiment, don't use it in production.**

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
      <input type="number" value={bind(b)} />

      <p>{a} + {b} = {a + b}</p>
    </div>
  );
};
```

Equals to:

```javascript
import React, { useState } from 'react';

export default () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);

  function handleChangeA(event) {
    setA(+event.target.value);
  }

  function handleChangeB(event) {
    setB(+event.target.value);
  }

  return (
    <div>
      <input type="number" value={a} onChange={handleChangeA}/>
      <input type="number" value={b} onChange={handleChangeB}/>

      <p>{a} + {b} = {a + b}</p>
    </div>
  );
};
```

## License

[MIT](LICENSE)
