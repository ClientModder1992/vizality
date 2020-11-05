const { AsyncComponent, Icon } = require('@vizality/components');
const { getModuleByDisplayName } = require('@vizality/webpack');
const { React } = require('@vizality/react');

const { close: closeModal } = require('@vizality/modal');

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
