const { React, getModuleByDisplayName, getModule, i18n: { Messages } } = require('vizality/webpack');
const { AsyncComponent } = require('vizality/components');
const { inject, uninject } = require('vizality/injector');
const { WEBSITE } = require('vizality/constants');
const { Plugin } = require('vizality/entities');

const ErrorBoundary = require('./components/ErrorBoundary');
const GeneralSettings = require('./components/GeneralSettings');
const Labs = require('./components/Labs');

const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle'));
const FormSection = AsyncComponent.from(getModuleByDisplayName('FormSection'));

module.exports = class Settings extends Plugin {
  startPlugin () {
    this.loadStylesheet('scss/style.scss');

    vizality.api.settings.registerSettings('Settings', {
      category: 'vz-general',
      label: () => Messages.VIZALITY_GENERAL_SETTINGS,
      render: GeneralSettings
    });

    this.patchSettingsComponent();
    this.patchExperiments();

    if (this.settings.get('__experimental_2019-12-16', false)) {
      this.log('Experimental Settings enabled.');
      this.patchSettingsContextMenu();
    }
  }

  async pluginWillUnload () {
    vizality.api.settings.unregisterSettings('Settings');
    uninject('vz-settings-items');
    uninject('vz-settings-actions');
    uninject('vz-settings-errorHandler');
  }

  async patchExperiments () {
    try {
      const experimentsModule = await getModule(r => r.isDeveloper !== void 0);
      Object.defineProperty(experimentsModule, 'isDeveloper', {
        get: () => vizality.settings.get('experiments', false)
      });

      // Ensure components do get the update
      experimentsModule._changeCallbacks.forEach(cb => cb());
    } catch (_) {
      // memes
    }
  }

  async patchSettingsComponent () {
    const SettingsView = await getModuleByDisplayName('SettingsView');
    inject('vz-settings-items', SettingsView.prototype, 'getPredicateSections', (args, sections) => {
      const changelog = sections.find(c => c.section === 'changelog');
      if (changelog) {
        if (vizality.settings.get('experiments', false)) {
          sections.splice(
            sections.indexOf(changelog) + 1, 0,
            {
              section: 'vz-labs',
              label: 'Vizality Labs',
              element: () => this._renderWrapper('Vizality Labs', Labs)
            }
          );
        }

        const settingsSections = Object.keys(vizality.api.settings.tabs).map(s => this._makeSection(s));
        sections.splice(
          sections.indexOf(changelog), 0,
          {
            section: 'HEADER',
            label: 'Vizality'
          },
          ...settingsSections,
          { section: 'DIVIDER' }
        );
      }

      if (sections.find(c => c.section === 'CUSTOM')) {
        sections.find(c => c.section === 'CUSTOM').element = ((_element) => function () {
          const res = _element();
          if (res.props.children && res.props.children.length === 3) {
            res.props.children.unshift(
              Object.assign({}, res.props.children[0], {
                props: Object.assign({}, res.props.children[0].props, {
                  href: WEBSITE,
                  title: 'Vizality',
                  className: `${res.props.children[0].props.className} vizality-vz-icon`
                })
              })
            );
          }
          return res;
        })(sections.find(c => c.section === 'CUSTOM').element);
      }

      const latestCommitHash = vizality.gitInfos.revision.substring(0, 7);
      const debugInfo = sections[sections.findIndex(c => c.section === 'CUSTOM') + 1];
      if (debugInfo) {
        debugInfo.element = ((_element) => function () {
          const res = _element();
          if (res.props.children && res.props.children.length === 3) {
            res.props.children.push(
              Object.assign({}, res.props.children[0], {
                props: Object.assign({}, res.props.children[0].props, {
                  children: [ 'Vizality', ' ', React.createElement('span', {
                    className: res.props.children[0].props.children[4].props.className,
                    children: [ vizality.gitInfos.branch, ' (', latestCommitHash, ')' ]
                  }) ]
                })
              })
            );
          }
          return res;
        })(debugInfo.element);
      }

      return sections;
    });
  }

  _makeSection (tabId) {
    const props = vizality.api.settings.tabs[tabId];
    const label = typeof props.label === 'function' ? props.label() : props.label;
    return {
      label,
      section: tabId,
      element: () => this._renderWrapper(label, props.render)
    };
  }

  _renderWrapper (label, Component) {
    return React.createElement(ErrorBoundary, null,
      React.createElement(FormSection, {},
        React.createElement(FormTitle, { tag: 'h2' }, label),
        React.createElement(Component)
      )
    );
  }

  async patchSettingsContextMenu () {
    const SubMenuItem = await getModuleByDisplayName('FluxContainer(SubMenuItem)');
    const ImageMenuItem = await getModuleByDisplayName('ImageMenuItem');
    const SettingsContextMenu = await getModuleByDisplayName('UserSettingsCogContextMenu');
    inject('vz-settings-actions', SettingsContextMenu.prototype, 'render', (args, res) => {
      const parent = React.createElement(SubMenuItem, {
        label: 'Vizality',
        render: () => vizality.api.settings.tabs.map(tab => React.createElement(ImageMenuItem, {
          label: tab.label,
          action: async () => {
            const settingsModule = await getModule([ 'open', 'saveAccountChanges' ]);
            settingsModule.open(tab.section);
          }
        }))
      });

      parent.key = 'Vizality';

      const items = res.props.children.find(child => Array.isArray(child));
      const changelog = items.find(item => item && item.key === 'changelog');
      if (changelog) {
        items.splice(items.indexOf(changelog), 0, parent);
      } else {
        this.error('Unable to locate \'Change Log\' item; forcing element to context menu!');
        res.props.children.push(parent);
      }

      return res;
    });
  }

  __toggleExperimental () {
    const current = this.settings.get('__experimental_2019-12-16', false);
    if (!current) {
      this.warn('WARNING: This will enable the new and experimental settings context menu, that is NOT functional yet.');
      this.warn('WARNING: Vizality staff won\'t accept bug reports from this experimental version, nor provide support!');
      this.warn('WARNING: Use it at your own risk! It\'s labeled experimental for a reason.');
    } else {
      this.log('Experimental Settings disabled.');
    }
    this.settings.set('__experimental_2019-12-16', !current);
    vizality.pluginManager.remount(this.entityID);
  }
};
