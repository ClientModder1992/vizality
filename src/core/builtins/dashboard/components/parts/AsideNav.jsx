import React, { memo, useState } from 'react';

import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';
import { Icon } from '@vizality/components';

export default memo(({ type, heading, sections }) => {
  const [ collapsed, setCollapsed ] = useState(false);
  const { auto, fade } = getModule('thin', 'scrollerBase');

  if (type === 'Components' || type === 'Getting Started') {
    heading = type;
    if (type === 'Components') {
      sections = [ 'Button', 'Button Group', 'Checkbox', 'Select', 'Slider', 'Switch', 'Text' ];
    }
  }

  return (
    <div className={joinClassNames('vz-aside-nav', { collapsed })}>
      <Icon
        className='vz-aside-nav-collapser'
        iconClassName='vz-aside-nav-collapser-icon'
        onClick={() => setCollapsed(false)}
        name='ArrowLeft'
      />
      <div className='vz-aside-nav-inner'>
        <div className='vz-aside-nav-header'>
          <div>{heading}</div>
          <Icon
            className='vz-aside-nav-header-icon-wrapper'
            iconClassName='vz-aside-nav-header-icon'
            onClick={() => setCollapsed(true)}
            style={{ transform: 'rotate(180deg)' }}
            name='ArrowLeft'
          />
        </div>
        <div className={joinClassNames('vz-aside-nav-items', auto, fade)}>
          {sections && sections.map(section => <div className='vz-aside-nav-item'>{section}</div>)}
        </div>
      </div>
    </div>
  );
});
