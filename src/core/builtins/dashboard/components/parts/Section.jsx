const { joinClassNames } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');
const { React } = require('@vizality/react');

const Header = React.memo(({ heading, subheading }) => {
  const { base } = getModule('base');
  const { size32 } = getModule('size24');
  const { content } = getModule('wrappedLayout');
  const { marginBottom40 } = getModule('marginBottom20');
  const { h1 } = getModule('h1', 'h2', 'h3');
  const { headerSubtext } = getModule('headerSubtext');

  return (
    <div className={`vz-dashboard-section-header-wrapper ${marginBottom40}`}>
      <h2 className={`vz-dashboard-section-header ${size32} ${base} ${content}`}>{heading}</h2>
      <h4 className={`vz-dashboard-section-header-subtext ${h1} ${headerSubtext}`}>
        {subheading}
      </h4>
    </div>
  );
});

module.exports = React.memo(({ heading, subheading, className, children }) => {
  return (
    <div className={joinClassNames('vz-dashboard-section', className)}>
      {heading && <Header heading={heading} subheading={subheading} />}
      <div className='vz-dashboard-section-contents'>
        {children}
      </div>
    </div>
  );
});
