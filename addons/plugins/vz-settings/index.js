const { getModuleByDisplayName, getModule } = require('@webpack');
// const { AsyncComponent } = require('@components');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');
const { Menu } = require('@components');
const { React } = require('@react');

const CoreSettings = require('./components/Settings');
const ContextMenu = require('./components/ContextMenu');
// const ErrorBoundary = require('./components/ErrorBoundary');

// const FormSection = AsyncComponent.from(getModuleByDisplayName('FormSection'));
// const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle'));

module.exports = class Settings extends Plugin {
  onStart () {
    this.injectStyles('styles/main.scss');

    vizality.api.settings.registerCoreDashboardSettings('vz-settings', {
      category: 'vz-settings',
      path: 'settings',
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

  patchSettingsContextMenu () {
    const SettingsContextMenu = getModule(m => m.default && m.default.displayName === 'UserSettingsCogContextMenu');
    console.log('cheese');
    patch('vz-settings-actions', SettingsContextMenu, 'default', (_, res) => {
      console.log(res);
      const parent = React.createElement(ContextMenu);
      console.log(ContextMenu);
      console.log(parent);
      const items = res.props.children.find(child => Array.isArray(child));
      items.push(ContextMenu.prototype.render());

      return res;
    });
  }
};
