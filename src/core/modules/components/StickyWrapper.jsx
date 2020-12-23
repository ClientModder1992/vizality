import React, { memo, useEffect, useRef } from 'react';

import { joinClassNames } from '@vizality/util';

export default memo(props => {
  const { className, wrapperClassName, children, handleStickyChange } = props;
  const sticky = useRef(null);

  delete props.className;
  delete props.wrapperClassName;

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
    <div ref={sticky} className={joinClassNames('vz-sticky-wrapper', wrapperClassName)} {...props}>
      <div className={joinClassNames('vz-sticky', className)}>
        {children}
      </div>
    </div>
  );
});
