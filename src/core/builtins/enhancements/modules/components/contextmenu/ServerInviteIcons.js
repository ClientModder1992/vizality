/*
 * Adds server icons to the 'Invite to Server' context submenu.
 */

import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export const labels = [ 'Components', 'ContextMenu' ];

export default main => {
  const MenuItem = getModule(m => m.default?.displayName === 'MenuItem');
  const GuildStore = getModule('getGuild');
  patch('vz-enhancements-context-menu-server-invite-icons', MenuItem, 'default', ([ props ], res) => {
    try {
      if (res.props?.id?.indexOf('user-context-invite-to-server--') || res.props['vz-guild-icon']) return;
      const { id } = props;
      const guildIconUrl = GuildStore.getGuild(id).getIconURL();
      res.props['vz-guild-icon'] = '';
      res.props['vz-no-icon'] = guildIconUrl && '';
      if (guildIconUrl) {
        res.props.style = { ...res.props.style, '--vz-guild-icon': `url(${guildIconUrl})` };
      }
    } catch (err) {
      return main.error(main._labels.concat(labels.concat('ServerInviteIcons')), err);
    }
  });
  return () => unpatch('vz-enhancements-context-menu-server-invite-icons');
};
