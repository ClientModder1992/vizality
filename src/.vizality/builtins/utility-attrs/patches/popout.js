/* eslint-disable no-unreachable */
const { getModuleByDisplayName } = require('@webpack');
const { patch, unpatch } = require('@patcher');

module.exports = async () => {
  return void 0;
  /* @todo: Causes problems with some popouts. 'Uncaught TypeError: res is not a function' */

  const Popout = getModuleByDisplayName('Popout');

  patch('vz-utility-attrs-popout', Popout.prototype, 'render', (_, res) => {
    if (!res.props) return res;

    if (res.props.shouldShow) document.documentElement.setAttribute('vz-popout-active', '');

    const result = res.props.onRequestClose;

    res.props.onRequestClose = (e) => {
      document.documentElement.removeAttribute('vz-popout-active');

      return result(e);
    };

    return res;
  });

  return async () => unpatch('vz-utility-attrs-popout');
};
