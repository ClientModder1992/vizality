import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

/*
 * Adds server icons to the 'Invite to Server' context submenu.
 */
export default () => {
  const MenuItem = getModule(m => m.default?.displayName === 'MenuItem');
  const GuildStore = getModule('getGuild');

  patch('vz-enhancements-context-menu-server-invite-icons', MenuItem, 'default', ([ props ], res) => {
    if (res.props?.id?.indexOf('user-context-invite-to-server--') || res.props['vz-guild-icon']) return res;

    const { id } = props;

    const guildIconUrl = GuildStore.getGuild(id).getIconURL();

    res.props['vz-guild-icon'] = '';
    res.props['vz-no-icon'] = guildIconUrl && '';

    if (guildIconUrl) {
      res.props.style = { ...res.props.style, '--vz-guild-icon': `url(${guildIconUrl})` };
    }

    return res;
  });

  return () => unpatch('vz-enhancements-context-menu-server-invite-icons');
};
