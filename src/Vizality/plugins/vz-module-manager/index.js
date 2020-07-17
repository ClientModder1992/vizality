const { React, constants: { Permissions }, getModule, getModuleByDisplayName, i18n: { Messages } } = require('vizality/webpack');
const { Icons: { Plugin: PluginIcon, Theme } } = require('vizality/components');
const { inject, uninject } = require('vizality/injector');
const { react : { forceUpdateElement } } = require('vizality/util');
const { Plugin } = require('vizality/entities');
const { MAGIC_CHANNELS: { STORE_PLUGINS, STORE_THEMES } } = require('vizality/constants');

const commands = require('./commands');
const deeplinks = require('./deeplinks');

const i18nStrings = require('./i18n');
const i18nLicenses = require('./licenses');

const Store = require('./components/store/Store');
const Plugins = require('./components/manage/Plugins');
const Themes = require('./components/manage/Themes');

module.exports = class ModuleManager extends Plugin {
  async startPlugin () {
    vizality.api.i18n.loadAllStrings(i18nStrings);
    vizality.api.i18n.loadAllStrings(i18nLicenses);

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

  pluginWillUnload () {
    vizality.api.router.unregisterRoute('/store/plugins');
    vizality.api.router.unregisterRoute('/store/themes');
    vizality.api.settings.unregisterSettings('Plugins');
    vizality.api.settings.unregisterSettings('Themes');
    Object.values(commands).forEach(cmd => vizality.api.commands.unregisterCommand(cmd.command));
    uninject('vz-module-manager-channelItem');
    uninject('vz-module-manager-channelProps');
  }

  async _injectCommunityContent () {
    const permissionsModule = getModule('can');
    inject('vz-module-manager-channelItem', permissionsModule, 'can', (args, retValue) => {
      const id = args[1].channelId || args[1].id;
      if (id === STORE_PLUGINS || id === STORE_THEMES) {
        return args[0] === Permissions.VIEW_CHANNEL;
      }
      return retValue;
    });

    const { transitionTo } = getModule('transitionTo');
    const ChannelItem = getModuleByDisplayName('ChannelItem');
    inject('vz-module-manager-channelProps', ChannelItem.prototype, 'render', function (_, retValue) {
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
        retValue.props.children[1].props.children[1].props.children = data[this.props.channel.id].name;
        retValue.props.children[1].props.children[0] = React.createElement(data[this.props.channel.id].icon, {
          className: retValue.props.children[1].props.children[0].props.className,
          width: 24,
          height: 24
        });
        retValue.props.onClick = () => transitionTo(data[this.props.channel.id].route);
        delete retValue.props.onMouseDown;
        delete retValue.props.onContextMenu;
      }
      return retValue;
    });

    const { containerDefault } = getModule('containerDefault');
    forceUpdateElement(`.${containerDefault}`, true);
  }

  async _fetchEntities (type) {
    vizality.api.notices.closeToast('vz-module-manager-fetch-entities');

    const entityManager = vizality[type === 'plugin' ? 'pluginManager' : 'styleManager'];
    const missingEntities = type === 'plugin' ? await entityManager.startPlugins(true) : await entityManager.loadThemes(true);
    const missingEntitiesList = missingEntities.length
      ? React.createElement('div', null,
        Messages.VIZALITY_MISSING_ENTITIES_RETRIEVED.format({ entity: type, count: missingEntities.length }),
        React.createElement('ul', null, missingEntities.map(entity =>
          React.createElement('li', null, `– ${entity}`))
        )
      )
      : Messages.VIZALITY_MISSING_ENTITIES_NONE;

    vizality.api.notices.sendToast('vz-module-manager-fetch-entities', {
      header: Messages.VIZALITY_MISSING_ENTITIES_FOUND.format({ entity: type, count: missingEntities.length }),
      content: missingEntitiesList,
      type: missingEntities.length > 0 && 'success',
      icon: type,
      timeout: 5e3,
      buttons: [
        {
          text: 'Got it',
          look: 'ghost'
        }
      ]
    });
  }
};
