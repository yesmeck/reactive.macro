# reactive.macro

Reduce boilerplate.

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
