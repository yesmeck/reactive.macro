import React from 'react';
import { state, bind } from '../../../lib/macro';

export default () => {
  let count = state(0);

  return React.createElement('input', {
    type: 'number',
    value: bind(count)
  });
};
