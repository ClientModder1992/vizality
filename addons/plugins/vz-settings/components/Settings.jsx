const { Confirm, settings: { TextInput, SwitchItem, ButtonItem, Category } } = require('@components');
const { open: openModal, close: closeModal } = require('vizality/modal');
const { file: { removeDirRecursive } } = require('@util');
const { React, React: { useState } } = require('@react');
const { Directories } = require('@constants');
const { getModule } = require('@webpack');
const { Messages } = require('@i18n');

module.exports = React.memo(() => {
  const [ isDiscordCacheCleared, setDiscordCacheCleared ] = useState(false);
  const [ isVizalityCacheCleared, setVizalityCacheCleared ] = useState(false);

  // eslint-disable-next-line consistent-this
  const _this = vizality.manager.plugins.get('vz-settings');

  const clearDiscordCache = () => {
    setDiscordCacheCleared(true);
    VizalityNative.clearCache().then(() => {
      setTimeout(() => {
        setDiscordCacheCleared(false);
      }, 2500);
    });
  };

  const clearVizalityCache = () => {
    setVizalityCacheCleared(true);
    removeDirRecursive(Directories.CACHE).then(() => {
      setTimeout(() => {
        setVizalityCacheCleared(false);
      }, 2500);
    });
  };

  const askRestart = () => {
    const { colorStandard } = getModule('colorStandard');

    openModal(() => <Confirm
      red
      header={Messages.ERRORS_RESTART_APP}
      confirmText={Messages.BUNDLE_READY_RESTART}
      cancelText={Messages.BUNDLE_READY_LATER}
      onConfirm={() => DiscordNative.app.relaunch()}
      onCancel={closeModal}
    >
      <div className={colorStandard}>
        {Messages.VIZALITY_SETTINGS_RESTART}
      </div>
    </Confirm>);
  };

  return (
    <div>
      <TextInput
        defaultValue={_this.settings.get('prefix', '.')}
        onChange={p => _this.settings.set('prefix', !p ? '.' : p.replace(/\s+(?=\S)|(?<=\s)\s+/g, '').toLowerCase())}
        onBlur={({ target }) => target.value = _this.settings.get('prefix', '.')}
        error={_this.settings.get('prefix', '.') === '/' ? 'Prefix should not be set to `/` as it is already in use by Discord and may disable Vizality autocompletions.' : ''}
      >
        {Messages.VIZALITY_COMMAND_PREFIX}
      </TextInput>

      <Category
        name={Messages.ADVANCED_SETTINGS}
        description={Messages.VIZALITY_SETTINGS_ADVANCED_DESC}
        opened={_this.settings.get('advancedSettings', false)}
        onChange={() => _this.settings.set('advancedSettings')}
      >
        <SwitchItem
          note={Messages.VIZALITY_SETTINGS_DEBUG_LOGS_DESC}
          value={_this.settings.get('debugLogs', false)}
          onChange={() => {
            _this.settings.set('debugLogs');
            askRestart();
          }}
        >
          {Messages.VIZALITY_SETTINGS_DEBUG_LOGS}
        </SwitchItem>
        <SwitchItem
          note={'Vizality\'s Software Development Kit (SDK) is a toolkit created to help make plugin developers\'s and theme developers\' lives easier. Once enabled, you can access it through an icon at the top right hand corner of the channel headerbar.'}
          value={_this.settings.get('sdkEnabled', false)}
          onChange={() => _this.settings.set('sdkEnabled')}
        >
          Enable Software Development Kit
        </SwitchItem>
        <SwitchItem
          note={Messages.VIZALITY_SETTINGS_OVERLAY_DESC}
          value={_this.settings.get('openOverlayDevTools', false)}
          onChange={() => _this.settings.set('openOverlayDevTools')}
        >
          {Messages.VIZALITY_SETTINGS_OVERLAY}
        </SwitchItem>
        <SwitchItem
          disabled={!!window.GlasscordApi}
          note={window.GlasscordApi
            ? Messages.VIZALITY_SETTINGS_TRANSPARENT_GLASSCORD.format({ glasscordCfgUrl: 'https://github.com/AryToNeX/Glasscord#how-do-i-use-it' })
            : Messages.VIZALITY_SETTINGS_TRANSPARENT_DESC.format()}
          value={_this.settings.get('transparentWindow', false)}
          onChange={() => {
            _this.settings.set('transparentWindow');
            askRestart();
          }}
        >
          {Messages.VIZALITY_SETTINGS_TRANSPARENT}
        </SwitchItem>
        <SwitchItem
          note={Messages.VIZALITY_SETTINGS_EXP_WEB_PLATFORM_DESC.format()}
          value={_this.settings.get('experimentalWebPlatform', false)}
          onChange={() => {
            _this.settings.set('experimentalWebPlatform');
            askRestart();
          }}
        >
          {Messages.VIZALITY_SETTINGS_EXP_WEB_PLATFORM}
        </SwitchItem>
        <SwitchItem
          note={Messages.VIZALITY_SETTINGS_DISCORD_EXPERIMENTS_DESC.format()}
          value={_this.settings.get('experiments', false)}
          onChange={() => {
            _this.settings.set('experiments');
            // Update modules
            const experimentsModule = getModule(r => r.isDeveloper !== void 0);
            experimentsModule._changeCallbacks.forEach(cb => cb());
          }}
        >
          {Messages.VIZALITY_SETTINGS_DISCORD_EXPERIMENTS}
        </SwitchItem>
      </Category>
      <ButtonItem
        note={Messages.VIZALITY_SETTINGS_CACHE_VIZALITY_DESC}
        button={isVizalityCacheCleared ? Messages.VIZALITY_SETTINGS_CACHE_CLEARED : Messages.VIZALITY_SETTINGS_CACHE_VIZALITY}
        success={isVizalityCacheCleared}
        onClick={() => clearVizalityCache()}
      >
        {Messages.VIZALITY_SETTINGS_CACHE_VIZALITY}
      </ButtonItem>
      <ButtonItem
        note={Messages.VIZALITY_SETTINGS_CACHE_DISCORD_DESC}
        button={isDiscordCacheCleared ? Messages.VIZALITY_SETTINGS_CACHE_CLEARED : Messages.VIZALITY_SETTINGS_CACHE_DISCORD}
        success={isDiscordCacheCleared}
        onClick={() => clearDiscordCache()}
      >
        {Messages.VIZALITY_SETTINGS_CACHE_DISCORD}
      </ButtonItem>
    </div>
  );
});
