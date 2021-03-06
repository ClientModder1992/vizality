import React from 'react';

import { open as openModal, close as closeModal } from '@vizality/modal';
import { getModuleByDisplayName, getModule } from '@vizality/webpack';
import { joinClassNames } from '@vizality/util/dom';
import { patch, unpatch } from '@vizality/patcher';
import { Confirm } from '@vizality/components';
import { Builtin } from '@vizality/entities';
import { Messages } from '@vizality/i18n';

import ContextMenu from './components/ContextMenu';
import Page from './components/Page';

export default class Settings extends Builtin {
  start () {
    this.injectStyles('styles/main.scss');

    vizality.api.settings._registerBuiltinPage({
      id: 'settings',
      addonId: this.addonId,
      path: '/settings',
      heading: 'Settings',
      subheading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.',
      icon: 'Gear',
      render: props => <Page {...props} />
    });

    vizality.api.actions.registerAction('CONFIRM_RESTART', () => this.confirmRestart());

    this.patchSettingsComponent();
    this.patchExperiments();
    this.patchSettingsContextMenu();
    this.patchSettingsContextMenuAddonItem();
  }

  stop () {
    vizality.api.routes.unregisterRoute('settings');
    vizality.api.actions.unregisterAction('CONFIRM_RESTART');
    unpatch('vz-settings-items');
    unpatch('vz-settings-context-menu');
    unpatch('vz-settings-context-menu-addon-items');
  }

  confirmRestart () {
    const { colorStandard } = getModule('colorStandard');
    const { spacing } = getModule('spacing', 'message');
    const { size16 } = getModule('size16');

    openModal(() => <Confirm
      red
      header={Messages.ERRORS_RESTART_APP}
      confirmText={Messages.BUNDLE_READY_RESTART}
      cancelText={Messages.BUNDLE_READY_LATER}
      onConfirm={() => DiscordNative.app.relaunch()}
      onCancel={closeModal}
    >
      <div className={joinClassNames(colorStandard, spacing, size16)}>
        {Messages.VIZALITY_SETTINGS_RESTART}
      </div>
    </Confirm>);
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
                  children: [ 'Vizality', ' ',
                    <span className={res.props.children[0].props.children[4].props.className}>
                      {`${vizality.git.branch} (${latestCommitHash})`}
                    </span> ]
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
    const SettingsContextMenu = getModule(m => m.default?.displayName === 'UserSettingsCogContextMenu');
    patch('vz-settings-context-menu', SettingsContextMenu, 'default', (_, res) => {
      const items = res.props.children.find(child => Array.isArray(child));
      items.push(ContextMenu.type().props.children[1]);
      return res;
    });
  }

  patchSettingsContextMenuAddonItem () {
    const MenuCheckboxItem = getModule(m => m.default?.displayName === 'MenuCheckboxItem');
    patch('vz-settings-context-menu-addon-items', MenuCheckboxItem, 'default', ([ props ], res) => {
      if ((res.props?.id?.indexOf('user-settings-cog-vizality--plugins--') &&
          res.props?.id?.indexOf('user-settings-cog-vizality--themes--')) ||
          res.props['vz-addon-icon']
      ) return;

      const addonIconUrl = props['vz-addon-icon'];

      res.props['vz-addon-icon'] = '';
      res.props['vz-addon-id'] = props.id;

      if (addonIconUrl) {
        res.props.style = { ...res.props.style, '--vz-addon-icon': `url(${addonIconUrl})` };
      }
    });
  }
}
