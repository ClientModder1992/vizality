import React, { memo } from 'react';

import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import { joinClassNames } from '@vizality/util';

import { FormItem, FormText, Tooltip, Button, Divider } from '..';

export default memo(props => {
  const { note, children, tooltipText, tooltipPosition, success, color, disabled, onClick, button } = props;

  const Flex = getModuleByDisplayName('Flex');
  const flex = joinClassNames(Flex.Direction.VERTICAL, Flex.Justify.START, Flex.Align.STRETCH, Flex.Wrap.NO_WRAP);
  const { marginBottom20 } = getModule('marginTop20');
  const { description } = getModule('formText', 'description');
  const { labelRow, title } = getModule('labelRow');

  return (
    <FormItem
      className={joinClassNames('vz-settings-item', 'vz-settings-button-item', flex, marginBottom20)}>
      <div className='vz-settings-button-item-inner'>
        <div className='vz-settings-button-item-info'>
          <div className={labelRow}>
            <label className={title}>
              {children}
            </label>
          </div>
          <FormText className={description}>
            {note}
          </FormText>
        </div>
        <Tooltip
          text={tooltipText}
          position={tooltipPosition}
          shouldShow={Boolean(tooltipText)}
          className='vz-settings-button-item-button-wrapper'
        >
          <Button
            color={success ? Button.Colors.GREEN : color || Button.Colors.BRAND}
            disabled={disabled}
            onClick={onClick}
            style={{ marginLeft: 5 }}
            className='vz-settings-button-item-button'
          >
            {button}
          </Button>
        </Tooltip>
      </div>
      <Divider />
    </FormItem>
  );
});
