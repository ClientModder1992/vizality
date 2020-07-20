const { React, getModuleByDisplayName } = require('@webpack');
const { AsyncComponent, Icons: { VizalityCutie } } = require('@components');
const { close: closeModal } = require('vizality/modal');

module.exports = AsyncComponent.from((async () => {
  const PremiumGuildModalHeader = getModuleByDisplayName('PremiumGuildModalHeader');
  return () => {
    const res = React.createElement(PremiumGuildModalHeader, { onClose: closeModal });

    const renderer = res.type;
    res.type = (props) => {
      const res = renderer(props);
      res.props.children[1] =
        <div className='vizality-cutie'>
          <VizalityCutie height={32}/>
        </div>;

      return res;
    };
    return res;
  };
})());
