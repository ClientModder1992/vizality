import React, { memo } from 'react';

import { AdvancedScrollerAuto, ErrorBoundary } from '@vizality/components';
import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';

export default memo(({ className, wrapperClassName, children }) => {
  const { pageWrapper } = getModule('pageWrapper');
  const { scroller } = getModule('headerContentWrapper');
  const { perksModal } = getModule('perksModal');
  const { base } = getModule('base');
  const { content } = getModule('wrappedLayout');

  return (
    <div className={joinClassNames('vz-dashboard', wrapperClassName, pageWrapper, perksModal)}>
      <AdvancedScrollerAuto className={`${scroller} vz-dashboard-scroller`}>
        <div className={joinClassNames('vz-dashboard-layout', className)}>
          <ErrorBoundary
            className='vz-dashboard-error-boundary'
            headerClassName={joinClassNames('vz-dashboard-content-header', base, content)}
          >
            {children}
          </ErrorBoundary>
        </div>
      </AdvancedScrollerAuto>
    </div>
  );
});
