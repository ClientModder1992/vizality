import React, { memo } from 'react';

import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import { joinClassNames } from '@vizality/util';

import { FormItem, FormText, Icon } from '..';

export default memo(props => {
  const { name, description, children, opened, onChange } = props;

  const Flex = getModuleByDisplayName('Flex');
  const flex = joinClassNames(Flex.Direction.VERTICAL, Flex.Justify.START, Flex.Align.STRETCH, Flex.Wrap.NO_WRAP);
  const { description: desc } = getModule('formText', 'description');
  const { labelRow, title } = getModule('labelRow');

  return (
    <FormItem className={joinClassNames('vz-c-settings-item vz-c-settings-category', flex)}>
      <div
        className={joinClassNames('vz-c-settings-category-title', 'vz-c-settings-title')}
        onClick={() => onChange(!opened)}
        vz-opened={opened ? '' : null}
      >
        <div className='vz-c-settings-category-title-inner'>
          <div className={labelRow}>
            <label class={title}>
              {name}
            </label>
          </div>
          <FormText className={desc}>
            {description}
          </FormText>
        </div>
        <Icon
          className='vz-c-settings-category-title-icon-wrapper'
          name='RightCaret'
          size='18'
        />
      </div>
      {opened &&
        <div className='vz-c-settings-category-inner'>
          {children}
        </div>
      }
    </FormItem>
  );
});
