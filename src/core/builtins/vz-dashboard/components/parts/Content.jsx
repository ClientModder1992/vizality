import React, { memo } from 'react';

import { Icon, Divider } from '@vizality/components';
import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';

export default memo(props => {
  const { icon, heading, subheading, className, children } = props;

  /**
   * @note Deleting these props as we've already stored their values and we don't want
   * to send them to the content div when we use spread props below.
   */
  delete props.icon;
  delete props.heading;
  delete props.subheading;
  delete props.className;
  delete props.children;

  const { marginBottom20 } = getModule('marginBottom20');
  const { headerSubtext } = getModule('headerSubtext');
  const { content } = getModule('wrappedLayout');
  const { h1 } = getModule('h1', 'h2', 'h3');
  const { base } = getModule('base');

  return (
    <div className={joinClassNames('vz-dashboard-content', className)} {...props}>
      {heading && <div className={`vz-dashboard-content-header-wrapper ${marginBottom20}`}>
        <div className='vz-dashboard-content-header-inner-wrapper'>
          {icon && <div className='vz-dashboard-content-header-icon-wrapper'>
            <Icon className='vz-dashboard-content-header-icon' name={icon} width={'100%'} height={'100%'} />
          </div>}
          <h1 className={`vz-dashboard-content-header ${base} ${content}`}>{heading}</h1>
        </div>
        {subheading && <>
          <h4 className={`vz-dashboard-content-header-subtext ${h1} ${headerSubtext}`}>
            {subheading}
          </h4>
          <Divider />
        </>}
      </div>}
      {children}
    </div>
  );
});
