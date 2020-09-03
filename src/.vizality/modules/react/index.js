const { getModule } = require('../webpack');

// eslint-disable-next-line no-unused-vars
const react = module.exports = {
  React: {
    ...getModule('render', 'createPortal')
  },
  ReactDOM: {
    ...getModule('createRef', 'createElement', 'Component', 'PureComponent')
  }
};
