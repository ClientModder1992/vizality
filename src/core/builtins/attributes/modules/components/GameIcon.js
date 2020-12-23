import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export default () => {
  const GameIcon = getModule(m => m.default?.displayName === 'GameIcon');

  patch('vz-attributes-game-icon', GameIcon, 'default', ([ props ], res) => {
    if (!props) return res;

    res.props['vz-no-icon'] = Boolean(!props.game) && '';

    return res;
  });

  return () => unpatch('vz-attributes-game-icon');
};
