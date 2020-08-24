const { Webpack, React, Patcher, Localize, Constants, Components, Util, Entities: { Plugin } } = require('@modules');

const Plugins = require('./components/manage/Plugins');
const Themes = require('./components/manage/Themes');
const Store = require('./components/store/Store');
const commands = require('./commands');
const i18n = require('./i18n');

module.exports = class AddonsManager extends Plugin {
  async onStart () {
    this.injectStyles('scss/style.scss');
    vizality.api.i18n.loadAllStrings(i18n);
    Object.values(commands).forEach(cmd => vizality.api.commands.registerCommand(cmd));

    vizality.api.settings.registerSettings('Plugins', {
      category: this.entityID,
      label: () => Localize.VIZALITY_ENTITIES.format({ entityType: 'Plugin' }),
      render: Plugins
    });

    vizality.api.settings.registerSettings('Themes', {
      category: this.entityID,
      label: () => Localize.VIZALITY_ENTITIES.format({ entityType: 'Theme' }),
      render: Themes
    });

    this._injectCommunityContent();

    vizality.api.router.registerRoute({
      path: '/store/plugins',
      render: Store,
      noSidebar: true
    });

    vizality.api.router.registerRoute({
      path: '/store/themes',
      render: Store,
      noSidebar: true
    });
  }

  onStop () {
    vizality.api.router.unregisterRoute('/store/plugins');
    vizality.api.router.unregisterRoute('/store/themes');
    vizality.api.settings.unregisterSettings('Plugins');
    vizality.api.settings.unregisterSettings('Themes');
    Object.values(commands).forEach(cmd => vizality.api.commands.unregisterCommand(cmd.command));
    Patcher.unpatch('vz-addons-manager-channelItem');
    Patcher.unpatch('vz-addons-manager-channelProps');
  }

  async _injectCommunityContent () {
    const permissionsModule = Webpack.getModule('can');
    Patcher.patch('vz-addons-manager-channelItem', permissionsModule, 'can', (args, res) => {
      const id = args[1].channelId || args[1].id;
      if (id === Constants.Channels.PLUGINS || id === Constants.Channels.THEMES) {
        // return args[0] === Permissions.VIEW_CHANNEL;
      }

      return res;
    });

    // const { transitionTo } = getModule('transitionTo');
    const ChannelItem = Webpack.getModuleByDisplayName('ChannelItem');
    patch('vz-addons-manager-channelProps', ChannelItem.prototype, 'render', function (_, res) {
      const data = {
        [Constants.Channels.PLUGINS]: {
          icon: Components.Icons.Plugin,
          name: Localize.VIZALITY_ENTITIES.format({ entityType: 'Plugin' }),
          route: '/_vizality/store/plugins'
        },
        [Constants.Channels.THEMES]: {
          icon: Components.Icons.Theme,
          name: Localize.VIZALITY_ENTITIES.format({ entityType: 'Theme' }),
          route: '/_vizality/store/themes'
        }
      };

      if (this.props.channel.id === Constants.Channels.PLUGINS || this.props.channel.id === Constants.Channels.THEMES) {
        res.props.children[1].props.children[0].props.children[1].props.children = data[this.props.channel.id].name;
        res.props.children[1].props.children[0].props.children[0] = React.createElement(data[this.props.channel.id].icon, {
          className: res.props.children[1].props.children[0].props.children[0].props.className,
          width: 24,
          height: 24
        });
        /*
         * res.props.onClick = () => transitionTo(data[this.props.channel.id].route);
         * delete res.props.onMouseDown;
         * delete res.props.onContextMenu;
         */
      }
      return res;
    });

    const { containerDefault } = Webpack.getModule('containerDefault');
    Util.React.forceUpdateElement(`.${containerDefault}`, true);
  }
};
