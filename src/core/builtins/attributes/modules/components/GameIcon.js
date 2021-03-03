import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export const labels = [ 'Components' ];

export default main => {
  const GameIcon = getModule(m => m.default?.displayName === 'GameIcon');
  patch('vz-attributes-game-icon', GameIcon, 'default', ([ props ], res) => {
    try {
      res.props['vz-no-icon'] = Boolean(props?.game) && '';
    } catch (err) {
      return main.error(main._labels.concat(labels.concat('GameIcon')), err);
    }
  });
  return () => unpatch('vz-attributes-game-icon');
};
