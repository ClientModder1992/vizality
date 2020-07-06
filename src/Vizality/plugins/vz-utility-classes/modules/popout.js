const { inject, uninject } = require('vizality/injector');
const { getModuleByDisplayName } = require('vizality/webpack');

module.exports = async () => {
  const Popout = await getModuleByDisplayName('Popout', true);

  inject('vz-utility-classes-popout', Popout.prototype, 'render', (originalArgs, returnValue) => {
    if (!returnValue.props) return returnValue;

    if (returnValue.props.shouldShow) document.documentElement.setAttribute('vz-popout-active', '');
    else document.documentElement.removeAttribute('vz-popout-active');

    return returnValue;
  });

  return async () => uninject('vz-utility-classes-popout');
};
