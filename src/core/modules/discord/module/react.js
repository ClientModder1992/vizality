const { getModule } = require('@vizality/webpack');

const react = {
  ...getModule('render', 'createPortal'),
  ...getModule('Component', 'PureComponent', 'createRef', 'createElement')
};

module.exports = react;
