import { forceUpdateElement } from '@vizality/util/react';
import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export default () => {
  const ListSectionItem = getModule(m => m.default?.displayName === 'ListSectionItem');
  const { membersGroup } = getModule('membersGroup');
  patch('vz-attributes-members-role-headerss', ListSectionItem, 'default', (_, res) => {
    /*
     * ListSectionItem is used for more than just channel member role headers, so let's make sure
     * we're targetting just the channel member role headers here.
     */
    if (!res.props?.children?.props?.children || !res.props?.className?.includes(membersGroup)) return;

    const currentGuildId = getModule('getLastSelectedGuildId').getGuildId();
    const currentGuild = getModule('getGuild', 'getGuilds').getGuild(currentGuildId);
    const guildRoles = Object.entries(currentGuild?.roles);
    const role = guildRoles?.find(role => role[1]?.name === res.props['vz-role-name']);
    res.props.style = { ...res.props.style, color: role?.colorString };
  });

  setImmediate(() => forceUpdateElement(`.${membersGroup}`));

  return () => unpatch('vz-attributes-members-role-headerss');
};
