const { getModuleByDisplayName } = require('@webpack');
const { AsyncComponent, Icon } = require('@components');
const { close: closeModal } = require('vizality/modal');
const { React } = require('@react');

module.exports = AsyncComponent.from((async () => {
  const PremiumGuildModalHeader = getModuleByDisplayName('PremiumGuildModalHeader');
  return () => {
    const res = React.createElement(PremiumGuildModalHeader, { onClose: closeModal });

    const renderer = res.type;
    res.type = (props) => {
      const res = renderer(props);
      res.props.children[1] =
        <div className='vizality-cutie'>
          <Icon name='Vizality' height={32}/>
        </div>;

      return res;
    };
    return res;
  };
})());
