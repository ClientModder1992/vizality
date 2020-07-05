const { inject, uninject } = require('vizality/injector');
const { getModule } = require('vizality/webpack');
const { joinClassNames } = require('vizality/util');

module.exports = async () => {
  const GameIcon = await getModule(m => m.default && m.default.displayName === 'GameIcon');

  inject('vz-utility-classes-gameIcon', GameIcon, 'default', ([ props ], returnValue) => {
    if (!props) return returnValue;

    const { game } = props;

    returnValue.props.className = joinClassNames(
      returnValue.props.className, {
        'vz-hasNoGameIcon': game === null
      });

    return returnValue;
  });

  return async () => uninject('vz-utility-classes-gameIcon');
};
