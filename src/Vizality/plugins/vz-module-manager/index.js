const { existsSync } = require('fs');
const { writeFile, readFile } = require('fs').promises;
const { React, constants: { Permissions }, getModule, getModuleByDisplayName, i18n: { Messages } } = require('vizality/webpack');
const { PopoutWindow, Icons: { Plugin: PluginIcon, Theme } } = require('vizality/components');
const { inject, uninject } = require('vizality/injector');
const { react : { findInReactTree, forceUpdateElement } } = require('vizality/util');
const { Plugin } = require('vizality/entities');
const { MAGIC_CHANNELS: { CSS_SNIPPETS, STORE_PLUGINS, STORE_THEMES } } = require('vizality/constants');
const { join } = require('path');

const commands = require('./commands');
const deeplinks = require('./deeplinks');
const i18n = require('./licenses/index');

const Store = require('./components/store/Store');
const Plugins = require('./components/manage/Plugins');
const Themes = require('./components/manage/Themes');
const QuickCSS = require('./components/manage/QuickCSS');
const SnippetButton = require('./components/SnippetButton');

module.exports = class ModuleManager extends Plugin {
  async startPlugin () {
    vizality.api.i18n.loadAllStrings(i18n);
    Object.values(commands).forEach(cmd => vizality.api.commands.registerCommand(cmd));

    vizality.api.labs.registerExperiment({
      id: 'vz-store',
      name: 'Vizality Store',
      date: 1571961600000,
      description: 'Vizality Plugin and Theme store',
      callback: () => {
        // We're supposed to do it properly but reload > all
        setImmediate(() => vizality.pluginManager.remount(this.entityID));
        // And we wrap it in setImmediate to not break the labs UI
      }
    });

    vizality.api.labs.registerExperiment({
      id: 'vz-deeplinks',
      name: 'Deeplinks',
      date: 1590242558077,
      description: 'Makes some vizality.com links trigger in-app navigation, as well as some potential embedding if applicable',
      callback: () => {
        // We're supposed to do it properly but reload > all
        setImmediate(() => vizality.pluginManager.remount(this.entityID));
        // And we wrap it in setImmediate to not break the labs UI
      }
    });

    this._quickCSS = '';
    this._quickCSSFile = join(__dirname, 'quickcss.css');
    this._loadQuickCSS();
    this._injectSnippets();
    this.loadStylesheet('scss/style.scss');
    vizality.api.settings.registerSettings('Plugins', {
      category: this.entityID,
      label: () => Messages.VIZALITY_PLUGINS,
      render: Plugins
    });
    vizality.api.settings.registerSettings('Themes', {
      category: this.entityID,
      label: () => Messages.VIZALITY_THEMES,
      render: (props) => React.createElement(Themes, {
        openPopout: () => this._openQuickCSSPopout(),
        ...props
      })
    });

    if (vizality.api.labs.isExperimentEnabled('vz-deeplinks')) {
      deeplinks();
    }

    if (vizality.api.labs.isExperimentEnabled('vz-store')) {
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
  }

  pluginWillUnload () {
    document.querySelector('#vizality-quickcss').remove();
    vizality.api.router.unregisterRoute('/store/plugins');
    vizality.api.router.unregisterRoute('/store/themes');
    vizality.api.settings.unregisterSettings('Plugins');
    vizality.api.settings.unregisterSettings('Themes');
    vizality.api.labs.unregisterExperiment('vz-store');
    vizality.api.labs.unregisterExperiment('vz-deeplinks');
    Object.values(commands).forEach(cmd => vizality.api.commands.unregisterCommand(cmd.command));
    uninject('vz-module-manager-channelItem');
    uninject('vz-module-manager-channelProps');
    uninject('vz-module-manager-snippets');
  }

  async _injectCommunityContent () {
    const permissionsModule = getModule('can');
    inject('vz-module-manager-channelItem', permissionsModule, 'can', (originalArgs, returnValue) => {
      const id = originalArgs[1].channelId || originalArgs[1].id;
      if (id === STORE_PLUGINS || id === STORE_THEMES) {
        return originalArgs[0] === Permissions.VIEW_CHANNEL;
      }
      return returnValue;
    });

    const { transitionTo } = getModule('transitionTo');
    const ChannelItem = getModuleByDisplayName('ChannelItem');
    inject('vz-module-manager-channelProps', ChannelItem.prototype, 'render', function (originalArgs, returnValue) {
      const data = {
        [STORE_PLUGINS]: {
          icon: PluginIcon,
          name: Messages.VIZALITY_PLUGINS,
          route: '/_vizality/store/plugins'
        },
        [STORE_THEMES]: {
          icon: Theme,
          name: Messages.VIZALITY_THEMES,
          route: '/_vizality/store/themes'
        }
      };

      if (this.props.channel.id === STORE_PLUGINS || this.props.channel.id === STORE_THEMES) {
        returnValue.props.children[1].props.children[1].props.children = data[this.props.channel.id].name;
        returnValue.props.children[1].props.children[0] = React.createElement(data[this.props.channel.id].icon, {
          className: returnValue.props.children[1].props.children[0].props.className,
          width: 24,
          height: 24
        });
        returnValue.props.onClick = () => transitionTo(data[this.props.channel.id].route);
        delete returnValue.props.onMouseDown;
        delete returnValue.props.onContextMenu;
      }
      return returnValue;
    });

    const { containerDefault } = getModule('containerDefault');
    forceUpdateElement(`.${containerDefault}`, true);
  }

  async _injectSnippets () {
    const MiniPopover = getModule(m => m.default && m.default.displayName === 'MiniPopover');
    inject('vz-module-manager-snippets', MiniPopover, 'default', (originalArgs, returnValue) => {
      const props = findInReactTree(returnValue, r => r && r.canReact && r.message);

      if (!props || props.channel.id !== CSS_SNIPPETS) return returnValue;

      returnValue.props.children.unshift(
        React.createElement(SnippetButton, {
          message: props.message,
          main: this
        })
      );

      return returnValue;
    });
  }

  async _applySnippet (message) {
    let css = '\n\n/**\n';
    const line1 = Messages.VIZALITY_SNIPPET_LINE1.format({ date: new Date() });
    const line2 = Messages.VIZALITY_SNIPPET_LINE2.format({
      authorTag: message.author.tag,
      authorId: message.author.id
    });
    css += ` * ${line1}\n`;
    css += ` * ${line2}\n`;
    css += ` * Snippet ID: ${message.id}\n`;
    css += ' */\n';
    for (const m of message.content.matchAll(/```((?:s?css)|(?:styl(?:us)?)|less)\n?([\s\S]*)`{3}/ig)) {
      let snippet = m[2].trim();
      switch (m[1].toLowerCase()) {
        case 'scss':
          snippet = '/* lol can\'t do scss for now */';
          break;
        case 'styl':
        case 'stylus':
          snippet = '/* lol can\'t do stylus for now */';
          break;
        case 'less':
          snippet = '/* lol can\'t do less for now */';
          break;
      }
      css += `${snippet}\n`;
    }
    this._saveQuickCSS(this._quickCSS + css);
  }

  async _fetchEntities (type) {
    vizality.api.notices.closeToast('missing-entities-notify');

    const entityManager = vizality[type === 'plugins' ? 'pluginManager' : 'styleManager'];
    const missingEntities = await type === 'plugins' ? entityManager.startPlugins(true) : entityManager.loadThemes(true);
    const entity = missingEntities.length === 1 ? type.slice(0, -1) : type;
    const subjectiveEntity = `${entity} ${entity === type ? 'were' : 'was'}`;

    let props;
    if (missingEntities.length > 0) {
      props = {
        header: `Found ${missingEntities.length} missing ${entity}!`,
        content: React.createElement('div', null,
          `The following ${subjectiveEntity} retrieved:`,
          React.createElement('ul', null, missingEntities.map(entity =>
            React.createElement('li', null, `– ${entity}`))
          )
        ),
        buttons: [ {
          text: 'OK',
          color: 'green',
          look: 'outlined'
        } ],
        type: 'success'
      };
    } else {
      props = {
        header: `No missing ${type} were found - try again later!`,
        type: 'danger',
        timeout: 10e3
      };
    }

    vizality.api.notices.sendToast('missing-entities-notify', props);
  }

  async _loadQuickCSS () {
    this._quickCSSElement = document.createElement('style');
    this._quickCSSElement.id = 'vizality-quickcss';
    document.head.appendChild(this._quickCSSElement);
    if (existsSync(this._quickCSSFile)) {
      this._quickCSS = await readFile(this._quickCSSFile, 'utf8');
      this._quickCSSElement.innerHTML = this._quickCSS;
    }
  }

  async _saveQuickCSS (css) {
    this._quickCSS = css.trim();
    this._quickCSSElement.innerHTML = this._quickCSS;
    await writeFile(this._quickCSSFile, this._quickCSS);
  }

  async _openQuickCSSPopout () {
    const popoutModule = getModule('setAlwaysOnTop', 'open');
    popoutModule.open('DISCORD_VIZALITY_QUICKCSS', (key) => (
      React.createElement(PopoutWindow, {
        windowKey: key,
        title: 'QuickCSS'
      }, React.createElement(QuickCSS, { popout: true }))
    ));
  }
};
