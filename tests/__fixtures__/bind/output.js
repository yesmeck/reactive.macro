import { useCallback as _useCallback } from "react";
import _getValue from "reactive.macro/lib/helpers/getValue";
import { useState as _useState } from "react";
import React from 'react';
export default (() => {
  const [count, _setcount] = _useState(0);

  return <input type="number" value={count} onChange={_useCallback(_e => _setcount(_getValue(_e)), [])} />;
});
