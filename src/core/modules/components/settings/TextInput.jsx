import React, { memo } from 'react';

import AsyncComponent from '../AsyncComponent';
import { FormItem } from '.';

const Input = AsyncComponent.fromDisplayName('TextInput');

export default memo(props => {
  const { children: title, note, required, className } = props;
  delete props.children;
  delete props.className;

  return (
    <FormItem title={title} note={note} required={required} noteHasMargin>
      <Input {...props} className={className} />
    </FormItem>
  );
});
