const { React, React: { useState } } = require('@react');
const { joinClassNames } = require('@utilities');
const { Icon } = require('@components');

module.exports = React.memo(({ type, header, sections }) => {
  const [ collapsed, setCollapsed ] = useState(false);

  if (type === 'Components' || type === 'Getting Started') {
    header = type;
    if (type === 'Components') {
      sections = [ 'Button', 'Button Group', 'Checkbox', 'Select', 'Slider', 'Switch', 'Text' ];
    }
  }

  return (
    <div className={joinClassNames('vizality-dashboard-aside', { collapsed })}>
      <div className='vizality-dashboard-aside-collapser' onClick={() => setCollapsed(false)}>
        <Icon className='vizality-dashboard-aside-collapser-icon' name={'ArrowLeft'} />
      </div>
      <div className='vizality-dashboard-aside-inner-wrapper'>
        <div className='vizality-dashboard-aside-header'>
          <div>{header}</div>
          <div className='vizality-icon-wrapper vizality-dashboard-aside-header-icon-wrapper' onClick={() => setCollapsed(true)}>
            <Icon className='vizality-dashboard-aside-header-icon' style={{ transform: 'rotate(180deg)' }} name={'ArrowLeft'} />
          </div>
        </div>
        {sections && sections.map(section => <div className='vizality-dashboard-aside-item'>{section}</div>)}
      </div>
    </div>
  );
});
