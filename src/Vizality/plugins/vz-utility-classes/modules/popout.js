const { getModuleByDisplayName } = require('@webpack');
const { inject, uninject } = require('@injector');

module.exports = async () => {
  return void 0;
  /* @todo: Causes problems with some popouts. 'Uncaught TypeError: res is not a function' */

  const Popout = getModuleByDisplayName('Popout');

  inject('vz-utility-classes-popout', Popout.prototype, 'render', (_, res) => {
    if (!res.props) return res;

    if (res.props.shouldShow) document.documentElement.setAttribute('vz-popout-active', '');

    const result = res.props.onRequestClose;

    res.props.onRequestClose = (e) => {
      document.documentElement.removeAttribute('vz-popout-active');

      return result(e);
    };

    return res;
  });

  return async () => uninject('vz-utility-classes-popout');
};
