const { inject, uninject } = require('vizality/injector');
const { getModuleByDisplayName } = require('vizality/webpack');

module.exports = async () => {
  return void 0;
  /* @todo: Causes problems with some popouts. 'Uncaught TypeError: res is not a function' */

  const Popout = getModuleByDisplayName('Popout');

  inject('vz-utility-classes-popout', Popout.prototype, 'render', (_, returnValue) => {
    if (!returnValue.props) return returnValue;

    if (returnValue.props.shouldShow) document.documentElement.setAttribute('vz-popout-active', '');

    const res = returnValue.props.onRequestClose;

    returnValue.props.onRequestClose = (e) => {
      document.documentElement.removeAttribute('vz-popout-active');

      return res(e);
    };

    return returnValue;
  });

  return async () => uninject('vz-utility-classes-popout');
};
