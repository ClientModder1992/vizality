import React, { memo } from 'react';

import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import { joinClassNames } from '@vizality/util';

import { FormItem, FormText, Tooltip, Button } from '..';

export default memo(props => {
  const { note, children, tooltipText, tooltipPosition, success, color, disabled, onClick, button } = props;

  const Flex = getModuleByDisplayName('Flex');
  const flex = joinClassNames(Flex.Direction.VERTICAL, Flex.Justify.START, Flex.Align.STRETCH, Flex.Wrap.NO_WRAP);
  const { marginBottom20 } = getModule('marginTop20');
  const { divider } = getModule(m => Object.keys(m).join('') === 'divider');
  const { dividerDefault } = getModule('dividerDefault');
  const { description } = getModule('formText', 'description');
  const { labelRow, title } = getModule('labelRow');

  return (
    <FormItem
      className={joinClassNames('vizality-settings-item', 'vizality-button-item', flex, marginBottom20)}>
      <div className='vizality-settings-item-title'>
        <div>
          <div className={labelRow}>
            <label class={title}>
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
        >
          {() => (
            <Button
              color={success ? Button.Colors.GREEN : color || Button.Colors.BRAND}
              disabled={disabled}
              onClick={onClick}
              style={{ marginLeft: 5 }}
            >
              {button}
            </Button>
          )}
        </Tooltip>
      </div>
      <div className={joinClassNames(divider, dividerDefault)} />
    </FormItem>
  );
});
