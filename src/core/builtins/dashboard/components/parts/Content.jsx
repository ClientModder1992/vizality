import React, { memo } from 'react';

import { excludeProperties } from '@vizality/util/object';
import { Icon, Divider } from '@vizality/components';
import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';

export default memo(props => {
  const { icon, heading, subheading, className, children } = props;
  const { marginBottom20 } = getModule('marginBottom20');
  const { headerSubtext } = getModule('headerSubtext');
  const { content } = getModule('wrappedLayout');
  const { h1 } = getModule('h1', 'h2', 'h3');
  const { base } = getModule('base');

  return (
    <div
      className={joinClassNames('vz-dashboard-content', className)}
      /**
       * @note Excluding these props as we've already stored their values and we don't want
       * to send them to the content div when we use spread props below to allow for
       * custom props/attributes.
       */
      {...excludeProperties(props, 'children', 'icon', 'heading', 'subheading', 'className')}
    >
      {heading &&
        <div className={joinClassNames('vz-dashboard-content-header-wrapper', marginBottom20)}>
          <div className='vz-dashboard-content-header-inner-wrapper'>
            {icon &&
              <Icon
                className='vz-dashboard-content-header-icon-wrapper'
                iconClassName='vz-dashboard-content-header-icon'
                name={icon}
                size='100%'
              />
            }
            <h1 className={joinClassNames('vz-dashboard-content-header', base, content)}>
              {heading}
            </h1>
          </div>
          {subheading && <>
            <h4 className={joinClassNames('vz-dashboard-content-header-subtext', h1, headerSubtext)}>
              {subheading}
            </h4>
            <Divider />
          </>}
        </div>
      }
      {children}
    </div>
  );
});
