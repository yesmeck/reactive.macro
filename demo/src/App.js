import React from 'react';
import { state, bind } from 'reactive.macro';
import './App.css';

function App() {
  let a = state(1);
  let b = state(2);

  return (
    <div className="App">
      <input type="number" value={bind(a)} />
      <button onClick={b => b += 1} >b+</button>

      <p>{a} + {b} = {a + b}</p>
    </div>
  );
}

export default App;
