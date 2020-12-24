import React, { memo } from 'react';

import { joinClassNames } from '@vizality/util';
import { getModule } from '@vizality/webpack';

import { FormTitle } from '..';

export default memo(props => {
  const { children, className } = props;
  delete props.className;
  delete props.children;

  const { marginBottom8 } = getModule('marginBottom8');

  return (
    <FormTitle className={joinClassNames(marginBottom8, className)} {...props}>
      {children}
    </FormTitle>
  );
});
