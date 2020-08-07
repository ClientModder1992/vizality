const { React, constants: { Permissions }, getModule, getModuleByDisplayName, i18n: { Messages } } = require('@webpack');
const { MAGIC_CHANNELS: { STORE_PLUGINS, STORE_THEMES } } = require('@constants');
const { Icons: { Plugin: PluginIcon, Theme } } = require('@components');
const { react : { forceUpdateElement } } = require('@utilities');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');

const deeplinks = require('./deeplinks');
const commands = require('./commands');

const i18n = require('./i18n');

const Plugins = require('./components/manage/Plugins');
const Themes = require('./components/manage/Themes');
const Store = require('./components/store/Store');

class AddonsManager extends Plugin {
  async onStart () {
    vizality.api.i18n.loadAllStrings(i18n);

    Object.values(commands).forEach(cmd => vizality.api.commands.registerCommand(cmd));

    this.loadStylesheet('scss/style.scss');
    vizality.api.settings.registerSettings('Plugins', {
      category: this.entityID,
      label: () => Messages.VIZALITY_ENTITIES.format({ entityType: 'Plugin' }),
      render: Plugins
    });
    vizality.api.settings.registerSettings('Themes', {
      category: this.entityID,
      label: () => Messages.VIZALITY_ENTITIES.format({ entityType: 'Theme' }),
      render: Themes
    });

    deeplinks();

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
    unpatch('vz-addons-manager-channelItem');
    unpatch('vz-addons-manager-channelProps');
  }

  async _injectCommunityContent () {
    const permissionsModule = getModule('can');
    patch('vz-addons-manager-channelItem', permissionsModule, 'can', (args, res) => {
      const id = args[1].channelId || args[1].id;
      if (id === STORE_PLUGINS || id === STORE_THEMES) {
        return args[0] === Permissions.VIEW_CHANNEL;
      }
      return res;
    });

    const { transitionTo } = getModule('transitionTo');
    const ChannelItem = getModuleByDisplayName('ChannelItem');
    patch('vz-addons-manager-channelProps', ChannelItem.prototype, 'render', function (_, res) {
      const data = {
        [STORE_PLUGINS]: {
          icon: PluginIcon,
          name: Messages.VIZALITY_ENTITIES.format({ entityType: 'Plugin' }),
          route: '/_vizality/store/plugins'
        },
        [STORE_THEMES]: {
          icon: Theme,
          name: Messages.VIZALITY_ENTITIES.format({ entityType: 'Theme' }),
          route: '/_vizality/store/themes'
        }
      };

      if (this.props.channel.id === STORE_PLUGINS || this.props.channel.id === STORE_THEMES) {
        res.props.children[1].props.children[1].props.children = data[this.props.channel.id].name;
        res.props.children[1].props.children[0] = React.createElement(data[this.props.channel.id].icon, {
          className: res.props.children[1].props.children[0].props.className,
          width: 24,
          height: 24
        });
        res.props.onClick = () => transitionTo(data[this.props.channel.id].route);
        delete res.props.onMouseDown;
        delete res.props.onContextMenu;
      }
      return res;
    });

    const { containerDefault } = getModule('containerDefault');
    forceUpdateElement(`.${containerDefault}`, true);
  }
}

module.exports = AddonsManager;
