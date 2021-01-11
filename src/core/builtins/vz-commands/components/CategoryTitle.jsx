import React, { memo } from 'react';

import { joinClassNames } from '@vizality/util/dom';
import { LazyImage } from '@vizality/components';
import { getModule } from '@vizality/webpack';

export default memo(props => {
  const { icon, id, children } = props;

  const { categoryHeader } = getModule('categoryHeader');
  const { wrapper } = getModule('image', 'infoWrapper');
  const { header, headerLabel, headerIcon } = getModule('header', 'headerLabel');

  return <div className={joinClassNames(wrapper, categoryHeader)} id={id}>
    <div className={header}>
      <div className={headerIcon}>
        <LazyImage
          className='vz-commands-category-header-icon'
          src={icon}
          width='16'
          height='16'
        />
      </div>
      <span className={headerLabel}>
        {children}
      </span>
    </div>
  </div>;
});
