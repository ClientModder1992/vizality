import React, { memo } from 'react';

import { joinClassNames } from '@vizality/util';
import { getModule } from '@vizality/webpack';

export default memo(props => {
  const { className } = props;
  delete props.className;

  const { dividerDefault } = getModule('dividerDefault');
  const { divider } = getModule(m => m.divider && Object.keys(m).length === 1);

  return <div className={joinClassNames(divider, dividerDefault, className)} {...props} />;
});
