const { joinClassNames } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');
const { Icon, Divider } = require('@vizality/components');
const { React } = require('@vizality/react');

module.exports = React.memo(({ icon, heading, subheading, className, children }) => {
  const { base } = getModule('base');
  const { content } = getModule('wrappedLayout');
  const { marginBottom20 } = getModule('marginBottom20');
  const { h1 } = getModule('h1', 'h2', 'h3');
  const { headerSubtext } = getModule('headerSubtext');

  return (
    <div className={joinClassNames('vz-dashboard-content', className)}>
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
