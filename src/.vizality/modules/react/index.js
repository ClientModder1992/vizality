/* eslint-disable no-unused-vars */

const { getModule } = require('../webpack');

module.exports = {
  React: {
    ...getModule('createRef', 'createElement', 'Component', 'PureComponent')
  },
  ReactDOM: {
    ...getModule('render', 'createPortal')
  },
  Router: {
    ...getModule('BrowserRouter', 'Router')
  }
};
