import React, { memo } from 'react';

import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';

import { Icon } from '.';

export default memo(props => {
  const { children } = props;

  const { error, backgroundRed, icon, text } = getModule('error', 'backgroundRed');
  const { marginBottom20 } = getModule('marginBottom20');

  return (
    <div className={joinClassNames(error, backgroundRed, marginBottom20)}>
      <Icon className={icon} name='WarningCircle' />
      <div className={text}>
        {children}
      </div>
    </div>
  );
});
