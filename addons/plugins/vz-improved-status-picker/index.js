const { getModule, React, i18n: { Messages } } = require('@webpack');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');

const PersonPlay = getModule(m => m.id && m.keys().includes('./Activity'))('./PersonPlay').default;

class GameActivityToggle extends Plugin {
  onStart () {
    this._injectGameActivityToggle();
  }

  onStop () {
    unpatch('game-activity-toggle');
  }

  _injectGameActivityToggle () {
    const classes = getModule('status', 'description');
    const settings = getModule('updateRemoteSettings');

    let { showCurrentGame } = getModule('showCurrentGame');

    const Menu = getModule(m => m.default && m.default.displayName === 'Menu');
    patch('game-activity-toggle', Menu, 'default', (originalArgs) => {
      if (originalArgs[0].navId !== 'status-picker') {
        return originalArgs;
      }

      const [ { children } ] = originalArgs;

      const onlineStatus = children.find(c => c.props.id === 'online');

      // Remove the divider after 'Online' because why is there one there anyway, Discord?
      if (!Object.keys(children[children.indexOf(onlineStatus) + 1].props).length) {
        children.splice(children.indexOf(onlineStatus) + 1, 1);
      }

      const invisibleStatus = children.find(c => c.props.id === 'invisible');

      if (!children.find(c => c.props.id === 'game-activity')) {
        children.splice(children.indexOf(invisibleStatus) + 1, 0, React.createElement(Menu.MenuItem, {
          id: 'game-activity',
          keepItemStyles: true,
          action: () => {
            showCurrentGame = !showCurrentGame;
            return settings.updateRemoteSettings({ showCurrentGame });
          },
          render: () => React.createElement('div', {
            className: classes.statusItem,
            'aria-label': `${!showCurrentGame ? 'Show' : 'Hide'} Game Activity`
          }, React.createElement(PersonPlay), React.createElement('div', {
            className: classes.status
          }, `${!showCurrentGame ? 'Show' : 'Hide'} Game Activity`), React.createElement('div', {
            className: classes.description
          }, Messages.SHOW_CURRENT_GAME))
        }));
      }

      return originalArgs;
    }, true);
  }
}

module.exports = GameActivityToggle;
