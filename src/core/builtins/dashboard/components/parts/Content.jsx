const { joinClassNames } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');
const { Icon } = require('@vizality/components');
const { React } = require('@vizality/react');

module.exports = React.memo(({ icon, heading, subheading, className, hasPadding, hasBackground, children }) => {
  const { base } = getModule('base');
  const { content } = getModule('wrappedLayout');
  const { marginBottom40 } = getModule('marginBottom20');
  const { h1 } = getModule('h1', 'h2', 'h3');
  const { headerSubtext } = getModule('headerSubtext');

  return (
    <div className={joinClassNames('vizality-dashboard-content', className, { 'vz-hasPadding': hasPadding, 'vz-hasBackground': hasBackground })}>
      {heading && <div className={`vizality-dashboard-content-header-wrapper ${marginBottom40}`}>
        <div className='vizality-dashboard-content-header-inner-wrapper'>
          {hasBackground && <div className='vizality-dashboard-content-header-background' />}
          {icon && <div className='vizality-dashboard-content-header-icon-wrapper'>
            <Icon className='vizality-dashboard-content-header-icon' name={icon} width={'100%'} height={'100%'} />
          </div>}
          <h1 className={`vizality-dashboard-content-header ${base} ${content}`}>{heading}</h1>
        </div>
        {subheading && <h4 className={`vizality-dashboard-content-header-subtext ${h1} ${headerSubtext}`}>
          {subheading}
        </h4>}
      </div>}
      {children}
    </div>
  );
});
