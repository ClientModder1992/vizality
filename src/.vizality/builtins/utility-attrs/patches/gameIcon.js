const { joinClassNames } = require('@util');
const { patch, unpatch } = require('@patcher');
const { getModule } = require('@webpack');

module.exports = () => {
  const GameIcon = getModule(m => m.default && m.default.displayName === 'GameIcon');

  patch('vz-utility-attrs-gameIcon', GameIcon, 'default', ([ props ], res) => {
    if (!props) return res;

    const { game } = props;

    res.props.className = joinClassNames(
      res.props.className, {
        'vz-hasNoGameIcon': game === null
      });

    return res;
  });

  return () => unpatch('vz-utility-attrs-gameIcon');
};
