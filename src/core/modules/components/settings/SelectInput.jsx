import React, { memo } from 'react';

import AsyncComponent from '../AsyncComponent';
import { FormItem } from '.';

const SelectTempWrapper = AsyncComponent.fromDisplayName('SelectTempWrapper');

export default memo(props => {
  const { children: title, note, required } = props;
  delete props.children;

  return (
    <FormItem title={title} note={note} required={required} noteHasMargin>
      <SelectTempWrapper {...props}/>
    </FormItem>
  );
});
