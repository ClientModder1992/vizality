import React, { memo } from 'react';

import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import { joinClassNames } from '@vizality/util/dom';

import { Divider, FormItem, FormText } from '..';

export default memo(props => {
  const { title, required, note, noteHasMargin, children, className } = props;
  delete props.className;

  const Flex = getModuleByDisplayName('Flex');
  const { description } = getModule('formText', 'description');
  const { marginBottom20, marginTop8 } = getModule('marginTop20');

  return (
    <FormItem
      title={title}
      required={required}
      className={joinClassNames(className, Flex.Direction.VERTICAL, Flex.Justify.START, Flex.Align.STRETCH, Flex.Wrap.NO_WRAP, marginBottom20)}
    >
      {children}
      {note &&
        <FormText className={joinClassNames(description, { [marginTop8]: noteHasMargin })}>
          {note}
        </FormText>
      }
      <Divider/>
    </FormItem>
  );
});
