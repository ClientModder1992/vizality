const { getModuleByDisplayName } = require('@webpack');

const AsyncComponent = require('./AsyncComponent');

module.exports = AsyncComponent.from(
  (async () => {
    const DecoratedGuildSettingsRoles = await getModuleByDisplayName('FluxContainer(GuildSettingsRoles)');
    const GuildSettingsRoles = DecoratedGuildSettingsRoles.prototype.render.call({ memoizedGetStateFromStores: () => void 0 }).type;
    const SettingsPanel = GuildSettingsRoles.prototype.renderRoleSettings.call({
      props: { guild: { isOwner: () => true } },
      renderHeader: () => null,
      getSelectedRole: () => '0'
    }).props.children[1].type;
    const SuspendedPicker = SettingsPanel.prototype.renderColorPicker.call({ props: { role: {} } }).props.children.type;
    const mdl = await SuspendedPicker().props.children.type._ctor();
    return mdl.default;
  })()
);