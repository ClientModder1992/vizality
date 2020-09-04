const { joinClassNames } = require('@util');
const { getModule } = require('@webpack');
const { React } = require('@react');

const Header = React.memo(({ header, subtext }) => {
  const { base } = getModule('base');
  const { size32 } = getModule('size24');
  const { content } = getModule('wrappedLayout');
  const { marginBottom40 } = getModule('marginBottom20');
  const { h1 } = getModule('h1', 'h2', 'h3');
  const { headerSubtext } = getModule('headerSubtext');

  return (
    <div className={`vizality-dashboard-section-header-wrapper ${marginBottom40}`}>
      <h2 className={`vizality-dashboard-section-header ${size32} ${base} ${content}`}>{header}</h2>
      <h4 className={`vizality-dashboard-section-header-subtext ${h1} ${headerSubtext}`}>
        {subtext}
      </h4>
    </div>
  );
});

module.exports = React.memo(({ header, subtext, className, children, hasPadding }) => {
  return (
    <div className={joinClassNames('vizality-dashboard-section', className, { 'vz-hasPadding': hasPadding })}>
      {header && <Header header={header} subtext={subtext} />}
      <div className='vizality-dashboard-section-contents'>
        {children}
      </div>
    </div>
  );
});
