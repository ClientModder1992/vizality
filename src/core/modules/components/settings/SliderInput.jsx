import React, { memo } from 'react';

import AsyncComponent from '../AsyncComponent';
import { FormItem } from '.';

const Slider = AsyncComponent.fromDisplayName('Slider');

export default memo(props => {
  const { children: title, note, required, className } = props;
  delete props.className;
  delete props.children;

  return (
    <FormItem title={title} note={note} required={required}>
      <Slider {...props} className={className} />
    </FormItem>
  );
});
