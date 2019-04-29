import * as React from 'react';

export default function getValue(event: any) {
  if (isEvent(event)) {
    const detypedEvent: any = event;
    const {
      target: { type, value, checked, files },
      dataTransfer
    } = detypedEvent;
    if (type === 'checkbox') {
      return !!checked;
    }
    if (type === 'file') {
      return files || (dataTransfer && dataTransfer.files);
    }
    if (type === 'select-multiple') {
      return getSelectedValues((event.target as HTMLSelectElement).options);
    }
    if (type === 'number') {
      return +value;
    }
    return value;
  }
  return event;
}

function isEvent(candidate: any): candidate is React.SyntheticEvent {
  return !!(candidate && candidate.stopPropagation && candidate.preventDefault);
}

function getSelectedValues(options: HTMLOptionsCollection) {
  const result = [];
  if (options) {
    for (let index = 0; index < options.length; index++) {
      const option = options[index];
      if (option.selected) {
        result.push(option.value);
      }
    }
  }
  return result;
}
