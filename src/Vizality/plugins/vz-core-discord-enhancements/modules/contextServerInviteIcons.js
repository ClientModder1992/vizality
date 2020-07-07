const { inject, uninject } = require('vizality/injector');
const { React, getModule } = require('vizality/webpack');
const { joinClassNames } = require('vizality/util');

/*
 * Adds server icons to the 'Invite to Server' context submenu.
 */

module.exports = async () => {
  const MenuItem = getModule(m => m.default && m.default.displayName === 'MenuItem');
  const originalMenuItem = MenuItem.default;
  const GuildStore = getModule('getGuild');

  inject('vz-cde-contextServerInviteIcons', MenuItem, 'default', ([ props ], returnValue) => {
    if (!returnValue.props || !returnValue.props.id || returnValue.props.id.indexOf('user-context-invite-to-server--')) return returnValue;

    const { id } = props;

    const guildIconUrl = GuildStore.getGuild(id).getIconURL();

    returnValue.props.className = joinClassNames(returnValue.props.className, { 'vz-hasNoGuildIcon': !guildIconUrl });

    console.log(guildIconUrl);
    const guildIcon = React.createElement('div', {
      className: joinClassNames('vizality-context-menu-icon-guild-icon', { 'vz-hasNoGuildIcon': !guildIconUrl }),
      style: {
        backgroundImage: guildIconUrl ? `url(${guildIconUrl})` : null
      }
    });

    returnValue.props.children.unshift(guildIcon);

    return returnValue;
  });

  Object.assign(MenuItem.default, originalMenuItem);

  return async () => uninject('vz-cde-contextServerInviteIcons');
};
