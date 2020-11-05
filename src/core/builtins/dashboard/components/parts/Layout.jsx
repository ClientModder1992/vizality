const { AdvancedScrollerAuto, ErrorBoundary } = require('@vizality/components');
const { joinClassNames } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');
const { React } = require('@vizality/react');

module.exports = React.memo(({ className, wrapperClassName, isFullWidth, children }) => {
  const { pageWrapper } = getModule('pageWrapper');
  const { scroller } = getModule('headerContentWrapper');
  const { perksModal } = getModule('perksModal');
  const { base } = getModule('base');
  const { content } = getModule('wrappedLayout');

  return (
    <div className={joinClassNames('vizality-dashboard', wrapperClassName, pageWrapper, perksModal)}>
      <AdvancedScrollerAuto className={`${scroller} vizality-dashboard-scroller`}>
        <div className={joinClassNames('vizality-dashboard-layout', className, { 'vz-isFullWidth': isFullWidth, 'vz-hasPadding': !isFullWidth })}>
          <ErrorBoundary
            className='vizality-dashboard-error-boundary'
            headerClassName={joinClassNames('vizality-dashboard-content-header', base, content)}
          >
            {children}
          </ErrorBoundary>
        </div>
      </AdvancedScrollerAuto>
    </div>
  );
});
