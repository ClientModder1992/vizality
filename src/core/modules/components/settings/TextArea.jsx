/* eslint-disable no-unused-vars */
import React, { memo } from 'react';

import AsyncComponent from '../AsyncComponent';
import { FormItem } from '.';

const TextArea = AsyncComponent.fromDisplayName('TextArea');

export default memo(props => {
  const { children: title, note, required, className, autoFocus, autoSize, disabled, flex, maxLength,
    name, onChange, placeholder, resizeable, rows, value } = props;
  delete props.children;
  delete props.className;

  return (
    <FormItem title={title} note={note} required={required} noteHasMargin>
      <TextArea {...props} className={className} />
    </FormItem>
  );
});

/**
 * AVAILABLE PROPS
 *
 * autoFocus={ false }
 * autosize={ false }
 * disabled={ false }
 * flex={ false }
 * maxLength={ 120 }
 * name={ '' }
 * onChange={ '' }
 * placeholder={ 'What can people do in this server?' }
 * resizeable={ false }
 * rows={ 3 }
 * value={ '' }
 */
