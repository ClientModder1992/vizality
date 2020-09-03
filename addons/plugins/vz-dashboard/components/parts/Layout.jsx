const { AdvancedScrollerAuto } = require('@components');
const { React, getModule } = require('@webpack');
const { joinClassNames } = require('@utilities');

module.exports = React.memo(({ className, wrapperClassName, isFullWidth, children }) => {
  const { pageWrapper } = getModule('pageWrapper');
  const { scroller } = getModule('headerContentWrapper');
  const { perksModal } = getModule('perksModal');

  return (
    <div className={joinClassNames('vizality-dashboard', wrapperClassName, pageWrapper, perksModal)}>
      <AdvancedScrollerAuto className={`${scroller} vizality-dashboard-scroller`}>
        <div className={joinClassNames('vizality-dashboard-layout', className, { 'vz-isFullWidth': isFullWidth, 'vz-hasPadding': !isFullWidth })}>
          {children}
        </div>
      </AdvancedScrollerAuto>
    </div>
  );
});
