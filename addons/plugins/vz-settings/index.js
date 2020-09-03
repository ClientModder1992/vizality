const { React, getModuleByDisplayName, getModule } = require('@webpack');
// const { AsyncComponent } = require('@components');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');

const CoreSettings = require('./components/Settings');
// const ErrorBoundary = require('./components/ErrorBoundary');

// const FormSection = AsyncComponent.from(getModuleByDisplayName('FormSection'));
// const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle'));

module.exports = class Settings extends Plugin {
  onStart () {
    this.injectStyles('scss/style.scss');

    vizality.api.settings.registerCoreDashboardSettings({
      path: 'settings',
      id: this.entityID,
      render: CoreSettings
    });

    this.patchSettingsComponent();
    this.patchExperiments();
    this.patchSettingsContextMenu();
  }

  onStop () {
    vizality.api.settings.unregisterSettings('Settings');
    unpatch('vz-settings-items');
    unpatch('vz-settings-actions');
    unpatch('vz-settings-errorHandler');
  }

  patchExperiments () {
    try {
      const experimentsModule = getModule(r => r.isDeveloper !== void 0);
      Object.defineProperty(experimentsModule, 'isDeveloper', {
        get: () => vizality.settings.get('experiments', false)
      });

      // Ensure components do get the update
      experimentsModule._changeCallbacks.forEach(cb => cb());
    } catch (err) {
      // :eyes:
    }
  }

  patchSettingsComponent () {
    const SettingsView = getModuleByDisplayName('SettingsView');
    patch('vz-settings-items', SettingsView.prototype, 'getPredicateSections', (_, sections) => {
      const latestCommitHash = vizality.git.revision.substring(0, 7);
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
                    children: [ vizality.git.branch, ' (', latestCommitHash, ')' ]
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

  // _makeSection (tabId) {
  //   const props = vizality.api.settings.tabs[tabId];
  //   const label = typeof props.label === 'function' ? props.label() : props.label;
  //   return {
  //     label,
  //     section: tabId,
  //     element: () => this._renderWrapper(label, props.render)
  //   };
  // }

  // _renderWrapper (label, Component) {
  //   return React.createElement(ErrorBoundary, null,
  //     React.createElement(FormSection, {},
  //       React.createElement(FormTitle, { tag: 'h2' }, label),
  //       React.createElement(Component)
  //     )
  //   );
  // }

  patchSettingsContextMenu () {
    const SubMenuItem = getModuleByDisplayName('FluxContainer(SubMenuItem)');
    const ImageMenuItem = getModuleByDisplayName('ImageMenuItem');
    const SettingsContextMenu = getModuleByDisplayName('UserSettingsCogContextMenu');
    patch('vz-settings-actions', SettingsContextMenu.prototype, 'render', (_, res) => {
      const parent = React.createElement(SubMenuItem, {
        label: 'Vizality',
        render: () => vizality.api.settings.tabs.map(tab => React.createElement(ImageMenuItem, {
          label: tab.label,
          action: async () => {
            const settingsModule = getModule('open', 'saveAccountChanges');
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
};
