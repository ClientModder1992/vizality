const { getModule, getModuleByDisplayName, messages, constants: discordConsts } = require('vizality/webpack');
const { inject, uninject } = require('vizality/injector');
const { Plugin } = require('vizality/entities');

const DocsLayer = require('./components/DocsLayer');

module.exports = class Documentation extends Plugin {
  startPlugin () {
    this.loadStylesheet('scss/style.scss');
    vizality.api.labs.registerExperiment({
      id: 'vz-docs',
      name: 'Documentation',
      date: 1572393600000,
      description: 'Vizality documentation for making plugin and themes',
      callback: enabled => {
        if (enabled) {
          this.addDocsItems();
        } else {
          uninject('vz-docs-tab');
        }
      }
    });

    if (vizality.api.labs.isExperimentEnabled('vz-docs')) {
      this.addDocsItems();
    }
  }

  pluginWillUnload () {
    uninject('vz-docs-tab');
    vizality.api.labs.unregisterExperiment('vz-docs');
  }

  async addDocsItems () {
    const { pushLayer } = getModule('pushLayer');
    const SettingsView = getModuleByDisplayName('SettingsView');
    inject('vz-docs-tab', SettingsView.prototype, 'getPredicateSections', (args, sections) => {
      const changelog = sections.find(c => c.section === 'changelog');
      if (changelog) {
        sections.splice(
          sections.indexOf(changelog) + 1, 0,
          {
            section: 'vz-documentation',
            onClick: async () => {
              await this._ensureHighlight();
              setImmediate(() => pushLayer(DocsLayer));
            },
            label: 'Vizality Docs'
          }
        );
      }

      return sections;
    });
  }

  async _ensureHighlight () {
    const module = getModule('highlight');
    if (typeof module.highlight !== 'function') {
      const currentChannel = getModule('getChannelId').getChannelId();
      if (!currentChannel) {
        const router = getModule('replaceWith');
        const channels = getModule('getChannels');
        const permissions = getModule('can');
        const currentLocation = window.location.pathname;
        const channel = channels.getChannels().find(c => c.type === 0 && permissions.can(discordConsts.Permissions.VIEW_CHANNEL, c));
        const route = discordConsts.Routes.CHANNEL(channel.guild_id, channel.id); // eslint-disable-line new-cap
        router.replaceWith(route);
        return setImmediate(async () => {
          await this._loadModule(channel.id);
          router.replaceWith(currentLocation);
        });
      }
      await this._loadModule(currentChannel);
    }
  }

  async _loadModule (channel) {
    const module = getModule('createBotMessage');
    const message = module.createBotMessage(channel, '```js\nconsole.log("yeet")\n```');
    messages.receiveMessage(channel, message);
    messages.deleteMessage(channel, message.id, true);
  }
};
