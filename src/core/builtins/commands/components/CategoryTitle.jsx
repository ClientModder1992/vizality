import React, { memo } from 'react';

import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';
import { Avatar } from '@vizality/components';

export default memo(props => {
  const { icon, children } = props;

  const { categoryHeader } = getModule('categoryHeader');
  const { wrapper } = getModule('image', 'infoWrapper');
  const { header, headerLabel, headerIcon } = getModule('header', 'headerLabel');

  return <div className={joinClassNames(wrapper, categoryHeader)}>
    <div className={header}>
      <div className={headerIcon}>
        <Avatar
          src={icon}
          size={Avatar.Sizes.SIZE_16}
        />
      </div>
      <span className={headerLabel}>
        {children}
      </span>
    </div>
  </div>;
});
