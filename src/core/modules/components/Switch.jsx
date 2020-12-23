import React, { memo } from 'react';

import AsyncComponent from './AsyncComponent';

const Switch = AsyncComponent.fromDisplayName('Switch');

export default memo(props => {
  // Compatibility for legacy syntax
  if (props.onChange && !props.__newOnChange) {
    const fn = props.onChange;
    props.onChange = (checked) => fn({ target: { checked } });
  }

  if (props.checked === void 0) {
    props.checked = props.value;
  }

  return <Switch {...props} />;
});
