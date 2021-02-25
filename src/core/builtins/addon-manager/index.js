import React from 'react';

import { open as openModal, close as closeModal } from '@vizality/modal';
import { Confirm, Text, LazyImage } from '@vizality/components';
import { toTitleCase, toPlural } from '@vizality/util/string';
import { Builtin } from '@vizality/entities';
import { Messages } from '@vizality/i18n';

import * as commands from './commands';
import * as i18n from './i18n';

export default class AddonsManager extends Builtin {
  start () {
    this.injectStyles('styles/main.scss');

    /**
     * We're doing this here because the addon managers are initialized before the components have initialized, so
     * it causes issues when trying to use the components inside the addon manager.
     */
    [ 'plugin', 'theme' ].forEach(type =>
      vizality.manager[toPlural(type)].uninstall = (addonId) => this.uninstallAddon(addonId, type));

    vizality.api.i18n.injectAllStrings(i18n);

    commands.registerCommands('plugin');
    commands.registerCommands('theme');
  }

  stop () {
    vizality.api.commands.unregisterCommand('plugin');
    vizality.api.commands.unregisterCommand('theme');
  }

  uninstallAddon (addonId, type) {
    const addon = vizality.manager[toPlural(type)].get(addonId);
    // @todo Make this an error modal or toast or something.
    if (!addon) return;
    openModal(() => (
      <Confirm
        red
        header={Messages.VIZALITY_ADDONS_UNINSTALL.format({ type: toTitleCase(type) })}
        confirmText={Messages.VIZALITY_ADDONS_UNINSTALL.format({ type: toTitleCase(type) })}
        cancelText={Messages.CANCEL}
        onCancel={closeModal}
        onConfirm={async () => {
          await vizality.manager[toPlural(type)]._uninstall(addonId);
          closeModal();
        }}
      >
        <Text>
          <span>{Messages.VIZALITY_ADDONS_UNINSTALL_SURE.format({ type })}</span>
          <ul className='vz-addon-uninstall-modal-ul'>
            <li className='vz-addon-uninstall-modal-li' vz-addon-id={addonId} key={addonId}>
              <div className='vz-addon-uninstall-modal-icon'>
                {addon && <LazyImage
                  className='vz-addon-uninstall-modal-icon-image-wrapper'
                  imageClassName='vz-addon-uninstall-modal-icon-img'
                  src={addon?.manifest?.icon}
                  width='20'
                  height='20'
                />}
              </div>
              <div className='vz-addon-uninstall-modal-name'>
                {addon?.manifest?.name}
              </div>
            </li>
          </ul>
        </Text>
      </Confirm>
    ));
  }
}
