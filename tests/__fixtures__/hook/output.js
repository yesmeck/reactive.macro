import { useState as _useState } from "react";
export default function useToggle() {
  const [visible, _setvisible] = _useState(false);

  const toggle = () => {
    _setvisible(_count => _count = !visible);
  };

  return [visible, toggle];
}
