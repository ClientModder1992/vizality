const { getModule } = require('@webpack');

const react = {
  ...getModule('render', 'createPortal'),
  ...getModule('Component', 'PureComponent', 'createRef', 'createElement')
};

module.exports = react;
