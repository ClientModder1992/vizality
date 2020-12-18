const { string: { toTitleCase, toPlural } } = require('@vizality/util');
const { Builtin } = require('@vizality/entities');
const { Messages } = require('@vizality/i18n');
const { Confirm, Text, LazyImage } = require('@vizality/components');
const { open: openModal, close: closeModal } = require('@vizality/modal');
const { React } = require('@vizality/react');

const commands = require('./commands');
const i18n = require('./i18n');

module.exports = class AddonsManager extends Builtin {
  onStart () {
    [ 'plugin', 'theme' ].forEach(type =>
      vizality.manager[toPlural(type)].uninstall = (addonId, addonType = type) => this.uninstallAddon(addonId, addonType));

    this.injectStyles('styles/main.scss');
    vizality.api.i18n.injectAllStrings(i18n);
    commands.registerCommands('plugin');
    commands.registerCommands('theme');
  }

  onStop () {
    commands.unregisterCommands();
    vizality.api.commands.unregisterCommand('plugin');
    vizality.api.commands.unregisterCommand('theme');
  }

  uninstallAddon (addonId, type) {
    let addons;

    // Themes
    if (type === 'theme') addons = [ addonId ];
    // Plugins
    else addons = [ addonId ].concat(vizality.manager[toPlural(type)].get(addonId).dependents);

    openModal(() => (
      <Confirm
        red
        header={Messages.VIZALITY_ADDONS_UNINSTALL.format({ type: toTitleCase(type), count: addons?.length })}
        confirmText={Messages.VIZALITY_ADDONS_UNINSTALL.format({ type: toTitleCase(type), count: addons?.length })}
        cancelText={Messages.CANCEL}
        onCancel={closeModal}
        onConfirm={async () => {
          for (const addon of addons) {
            await vizality.manager[toPlural(type)].uninstall(addon);
          }
          closeModal();
        }}
      >
        <Text>
          <span>{Messages.VIZALITY_ADDONS_UNINSTALL_SURE.format({ type, count: addons?.length })}</span>
          <ul className='vz-addon-uninstall-modal-ul'>
            {addons.map(p => {
              const addon = vizality.manager[toPlural(type)].get(p);
              return (
                <li className='vz-addon-uninstall-modal-li' vz-addon-id={p} key={p.id}>
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
              );
            })}
          </ul>
        </Text>
      </Confirm>
    ));
  };
};
