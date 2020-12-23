import React, { memo } from 'react';

import { getModuleByDisplayName, getModule } from '@vizality/webpack';

import AsyncComponent from '../AsyncComponent';
import { Divider } from '..';

const Checkbox = AsyncComponent.fromDisplayName('Checkbox');

export default memo(props => {
  // eslint-disable-next-line no-unused-vars
  const { align, color, disabled, onChange, readOnly, reverse, shape, size, type, value } = props;

  const Flex = getModuleByDisplayName('Flex');
  const { marginBottom20 } = getModule('marginBottom20');

  return (
    <Flex className={marginBottom20} direction={Flex.Direction.VERTICAL}>
      <Checkbox {...props}/>
      <Divider/>
    </Flex>
  );
});

/**
 * AVAILABLE PROPS
 *
 * align={ 'alignCenter-MrlN6q' }
 * color={ '#7289da' }
 * disabled={ false }
 * onChange={ '' }
 * readOnly={ false }
 * reverse={ false }
 * shape={ 'box-mmYMsp' }
 * size={ 24 }
 * type={ 'inverted' }
 * value={ true }
 */
