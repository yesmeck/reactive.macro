import { useState as _useState } from "react";
import React from 'react';
export default (() => {
  const [count, _setcount] = _useState(0);

  return <input type="number" value={count} onChange={_e => _setcount(_e.target.value)} />;
});
