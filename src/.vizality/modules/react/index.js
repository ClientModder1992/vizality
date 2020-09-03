const { getModule } = require('../webpack');

const react = {
  ...getModule('render', 'createPortal'),
  ...getModule('createRef', 'createElement', 'Component', 'PureComponent')
};

module.exports = react;
