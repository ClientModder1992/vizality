const { joinClassNames } = require('@util');
const { patch, unpatch } = require('@patcher');
const { getModule } = require('@webpack');
const { React } = require('@react');

/*
 * Adds server icons to the 'Invite to Server' context submenu.
 */

/*
 * @todo Try to convert this and utility-class ones into:
 * const contextServerInviteIcons = module.exports = () => {
 */
const contextServerInviteIcons = () => {
  const MenuItem = getModule(m => m.default && m.default.displayName === 'MenuItem');
  const GuildStore = getModule('getGuild');

  patch('vz-cde-contextMenu-serverInviteIcons', MenuItem, 'default', ([ props ], res) => {
    if (!res.props || !res.props.id || res.props.id.indexOf('user-context-invite-to-server--')) return res;

    const { id } = props;

    const guildIconUrl = GuildStore.getGuild(id).getIconURL();

    res.props.className = joinClassNames(res.props.className, { 'vz-hasNoGuildIcon': !guildIconUrl });

    const guildIcon = React.createElement('div', {
      className: joinClassNames('vizality-context-menu-icon-guild-icon', { 'vz-hasNoGuildIcon': !guildIconUrl }),
      style: {
        backgroundImage: guildIconUrl ? `url(${guildIconUrl})` : null
      }
    });

    res.props.children.unshift(guildIcon);

    return res;
  });

  return async () => unpatch('vz-cde-contextMenu-serverInviteIcons');
};

module.exports = contextServerInviteIcons;
