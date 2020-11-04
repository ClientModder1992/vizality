const { getModuleByDisplayName, getModule } = require('@webpack');
// const { AsyncComponent } = require('@components');
const { patch, unpatch } = require('@patcher');
const { Builtin } = require('@entities');
const { React } = require('@react');

const ContextMenu = require('./components/ContextMenu');
const _Settings = require('./components/Settings');

module.exports = class Settings extends Builtin {
  onStart () {
    this.injectStyles('styles/main.scss');

    // vizality.api.settings.registerSettings('vz-settings', {
    //   category: 'vz-settings',
    //   label: () => 'Settings',
    //   render: CoreSettings
    // });

    vizality.api.settings.registerDashboardItem({
      id: this.entityID,
      path: 'settings',
      heading: 'Settings',
      subheading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.',
      icon: 'Wrench',
      render: _Settings
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
    patch('vz-settings-actions', SettingsContextMenu, 'default', (_, res) => {
      const items = res.props.children.find(child => Array.isArray(child));
      items.push(ContextMenu.prototype.render());
      return res;
    });
  }
};
