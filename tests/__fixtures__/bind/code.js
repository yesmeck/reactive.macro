import { useState as _useState } from "react";
import React from 'react';
import { bind } from '../../../lib/macro';

export default (() => {
  const [count, _setcount] = _useState(0);

  return <input type="number" value={bind(count)} />;
});
