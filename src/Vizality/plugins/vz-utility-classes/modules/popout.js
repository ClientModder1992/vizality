const { inject, uninject } = require('vizality/injector');
const { getModuleByDisplayName } = require('vizality/webpack');

module.exports = async () => {
  const Popout = getModuleByDisplayName('Popout');

  inject('vz-utility-classes-popout', Popout.prototype, 'render', (originalArgs, returnValue) => {
    if (!returnValue.props) return returnValue;

    if (returnValue.props.shouldShow) document.documentElement.setAttribute('vz-popout-active', '');

    const res = returnValue.props.onRequestClose;

    returnValue.props.onRequestClose = function (originalArgs) {
      document.documentElement.removeAttribute('vz-popout-active');

      return res(originalArgs);
    };

    return returnValue;
  });

  return async () => uninject('vz-utility-classes-popout');
};
