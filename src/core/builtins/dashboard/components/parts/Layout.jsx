const { AdvancedScrollerAuto, ErrorBoundary } = require('@vizality/components');
const { joinClassNames } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');
const { React } = require('@vizality/react');

module.exports = React.memo(({ className, wrapperClassName, children }) => {
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
