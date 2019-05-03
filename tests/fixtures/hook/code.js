import { state } from '../../../lib/macro';

export default function useToggle() {
  let visible = state(false);

  const toggle = () => {
    visible = !visible
  }

  return [visible, toggle];
}
