import React from 'react';

import { open as openModal, close as closeModal } from '@vizality/modal';
import { Confirm, Text, LazyImage } from '@vizality/components';
import { toTitleCase, toPlural } from '@vizality/util/string';
import { Builtin } from '@vizality/entities';
import { Messages } from '@vizality/i18n';

import * as commands from './commands';
import * as i18n from './i18n';

export default class AddonsManager extends Builtin {
  onStart () {
    this.injectStyles('styles/main.scss');

    [ 'plugin', 'theme' ].forEach(type =>
      vizality.manager[toPlural(type)].uninstall = (addonId, addonType = type) => this.uninstallAddon(addonId, addonType));

    vizality.api.i18n.injectAllStrings(i18n);

    commands.registerCommands('plugin');
    commands.registerCommands('theme');
  }

  onStop () {
    vizality.api.commands.unregisterCommand('plugin');
    vizality.api.commands.unregisterCommand('theme');
  }

  uninstallAddon (addonId, type) {
    const addon = vizality.manager[toPlural(type)].get(addonId);

    openModal(() => (
      <Confirm
        red
        header={Messages.VIZALITY_ADDONS_UNINSTALL.format({ type: toTitleCase(type) })}
        confirmText={Messages.VIZALITY_ADDONS_UNINSTALL.format({ type: toTitleCase(type) })}
        cancelText={Messages.CANCEL}
        onCancel={closeModal}
        onConfirm={async () => {
          await vizality.manager[toPlural(type)].uninstall(addonId);
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