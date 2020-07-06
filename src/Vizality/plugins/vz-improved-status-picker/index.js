const { Plugin } = require('vizality/entities');
const { getModule, React, i18n: { Messages } } = require('vizality/webpack');
const { inject, uninject } = require('vizality/injector');

const PersonPlay = getModule(m => m.id && m.keys().includes('./Activity'))('./PersonPlay').default;

module.exports = class GameActivityToggle extends Plugin {
  async startPlugin () {
    const classes = await getModule([ 'status', 'description' ], true);
    const settings = await getModule([ 'updateRemoteSettings' ], true);

    let { showCurrentGame } = await getModule([ 'showCurrentGame' ]);

    const Menu = await getModule(m => m.default && m.default.displayName === 'Menu', true);
    inject('game-activity-toggle', Menu, 'default', (originalArgs) => {
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

  pluginWillUnload () {
    uninject('game-activity-toggle');
  }
};
