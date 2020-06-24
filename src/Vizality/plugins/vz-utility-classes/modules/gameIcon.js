const { inject, uninject } = require('vizality/injector');
const { getModule } = require('vizality/webpack');
const { classNames } = require('vizality/util');

module.exports = async () => {
  const GameIcon = await getModule(m => m.default && m.default.displayName === 'GameIcon');
  const originalGameIcon = GameIcon.default;

  inject('vz-utility-classes-gameIcon', GameIcon, 'default', ([ props ], returnValue) => {
    if (!props) return returnValue;

    const { game } = props;

    returnValue.props.className = classNames(
      returnValue.props.className, {
        'vz-hasNoGameIcon': game === null
      });

    return returnValue;
  });

  Object.assign(GameIcon.default, originalGameIcon);

  return async () => uninject('vz-utility-classes-gameIcon');
};
