import React, { memo, useEffect, useRef } from 'react';

import { excludeProperties } from '@vizality/util/object';
import { joinClassNames } from '@vizality/util/dom';

export default memo(props => {
  const { className, wrapperClassName, children, handleStickyChange } = props;
  const sticky = useRef(null);

  const _handleStickyChange = (state, element) => {
    handleStickyChange(state, element);
  };

  const observe = () => {
    const observer = new IntersectionObserver(([ entry ]) => {
      if (entry.intersectionRatio < 1) {
        entry.target.setAttribute('vz-stuck', '');
        _handleStickyChange('stuck', entry.target);
      } else {
        entry.target.removeAttribute('vz-stuck');
        _handleStickyChange('unstuck', entry.target);
      }
    }, { threshold: [ 1 ] });

    observer.observe(sticky.current);

    return () => observer.unobserve(sticky.current);
  };

  useEffect(() => {
    observe();
  }, []);

  return (
    <div
      ref={sticky}
      className={joinClassNames('vz-sticky-wrapper', wrapperClassName)}
      {...excludeProperties(props, 'children', 'className', 'wrapperClassName')}
    >
      <div className={joinClassNames('vz-sticky', className)}>
        {children}
      </div>
    </div>
  );
});
