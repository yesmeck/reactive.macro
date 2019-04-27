import React from 'react';
import { state } from '../../../lib/macro';

export default () => {
  let count = state(0);

  return (
    <button onClick={() => (count += 1)}>
      Clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
  );
};
