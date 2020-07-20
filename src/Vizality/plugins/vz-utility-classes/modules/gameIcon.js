const { inject, uninject } = require('@injector');
const { joinClassNames } = require('@util');
const { getModule } = require('@webpack');

module.exports = () => {
  const GameIcon = getModule(m => m.default && m.default.displayName === 'GameIcon');

  inject('vz-utility-classes-gameIcon', GameIcon, 'default', ([ props ], res) => {
    if (!props) return res;

    const { game } = props;

    res.props.className = joinClassNames(
      res.props.className, {
        'vz-hasNoGameIcon': game === null
      });

    return res;
  });

  return () => uninject('vz-utility-classes-gameIcon');
};
