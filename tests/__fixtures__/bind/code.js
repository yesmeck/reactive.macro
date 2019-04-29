import React from 'react';
import { state, bind } from '../../../lib/macro';

export default (() => {
  let count = state(0);

  return <input type="number" value={bind(count)} />;
});
