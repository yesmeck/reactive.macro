import { useState as _useState } from "react";
import React from 'react';
export default (() => {
  const [count, _setcount] = _useState(0);

  return <button onClick={() => _setcount(_count => _count += 1)}>
      Clicked {count} {count === 1 ? 'time' : 'times'}
    </button>;
});
