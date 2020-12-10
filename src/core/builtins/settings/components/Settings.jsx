const { settings: { TextInput, SwitchItem, ButtonItem, Category }, Icon, Confirm } = require('@vizality/components');
const { file: { removeDirRecursive } } = require('@vizality/util');
const { React, React: { useState } } = require('@vizality/react');
const { Directories } = require('@vizality/constants');
const { getModule } = require('@vizality/webpack');
const { Messages } = require('@vizality/i18n');

const { open: openModal, close: closeModal } = require('@vizality/modal');

module.exports = React.memo(({ getSetting, toggleSetting, updateSetting }) => {
  const [ isDiscordCacheCleared, setDiscordCacheCleared ] = useState(false);
  const [ isVizalityCacheCleared, setVizalityCacheCleared ] = useState(false);

  const clearDiscordCache = () => {
    setDiscordCacheCleared(true);
    vizality.native.clearCache().then(() => {
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
        defaultValue={getSetting('prefix', '.')}
        onChange={p => updateSetting('prefix', !p ? '.' : p.replace(/\s+(?=\S)|(?<=\s)\s+/g, '').toLowerCase())}
        onBlur={({ target }) => target.value = getSetting('prefix', '.')}
        error={getSetting('prefix', '.') === '/' ? 'Prefix should not be set to `/` as it is already in use by Discord and may disable Vizality autocompletions.' : ''}
      >
        {Messages.VIZALITY_COMMAND_PREFIX}
      </TextInput>
      <SwitchItem
        note={Messages.VIZALITY_SETTINGS_NO_CLYDE_DESC.format({ discordiaUrl: 'https://discordia.me/clyde', apiUrl:  `${window.location.origin}/vizality/dashboard/documentation` })}
        value={getSetting('replaceClyde', true)}
        onChange={() => toggleSetting('replaceClyde', true)}
      >
        <Icon
          className='vz-settings-eradicate-clyde-icon-wrapper'
          iconClassName='vz-settings-eradicate-clyde-icon'
          name='Robot'
          size='20px'
        />
        {Messages.VIZALITY_SETTINGS_NO_CLYDE}
      </SwitchItem>
      <Category
        name={Messages.ADVANCED_SETTINGS}
        description={Messages.VIZALITY_SETTINGS_ADVANCED_DESC}
        opened={getSetting('advancedSettings', false)}
        onChange={() => toggleSetting('advancedSettings')}
      >
        <SwitchItem
          note={Messages.VIZALITY_SETTINGS_DEBUG_LOGS_DESC}
          value={getSetting('debugLogs', false)}
          onChange={() => {
            toggleSetting('debugLogs');
            askRestart();
          }}
        >
          {Messages.VIZALITY_SETTINGS_DEBUG_LOGS}
        </SwitchItem>
        <SwitchItem
          note={'Vizality\'s Software Development Kit (SDK) is a toolkit created to help make plugin developers\'s and theme developers\' lives easier. Once enabled, you can access it through an icon at the top right hand corner of the channel headerbar.'}
          value={getSetting('sdkEnabled', false)}
          onChange={() => toggleSetting('sdkEnabled')}
        >
          Enable Software Development Kit
        </SwitchItem>
        <SwitchItem
          note={Messages.VIZALITY_SETTINGS_OVERLAY_DESC}
          value={getSetting('openOverlayDevTools', false)}
          onChange={() => toggleSetting('openOverlayDevTools')}
        >
          {Messages.VIZALITY_SETTINGS_OVERLAY}
        </SwitchItem>
        <SwitchItem
          note={Messages.VIZALITY_SETTINGS_KEEP_TOKEN_DESC}
          value={getSetting('hideToken', true)}
          onChange={() => toggleSetting('hideToken', true)}
        >
          {Messages.VIZALITY_SETTINGS_KEEP_TOKEN}
        </SwitchItem>
        <SwitchItem
          disabled={!!window.GlasscordApi}
          note={window.GlasscordApi
            ? Messages.VIZALITY_SETTINGS_TRANSPARENT_GLASSCORD.format({ glasscordCfgUrl: 'https://github.com/AryToNeX/Glasscord#how-do-i-use-it' })
            : Messages.VIZALITY_SETTINGS_TRANSPARENT_DESC.format()}
          value={getSetting('transparentWindow', false)}
          onChange={() => {
            toggleSetting('transparentWindow');
            askRestart();
          }}
        >
          {Messages.VIZALITY_SETTINGS_TRANSPARENT}
        </SwitchItem>
        <SwitchItem
          note={Messages.VIZALITY_SETTINGS_EXP_WEB_PLATFORM_DESC.format()}
          value={getSetting('experimentalWebPlatform', false)}
          onChange={() => {
            toggleSetting('experimentalWebPlatform');
            askRestart();
          }}
        >
          {Messages.VIZALITY_SETTINGS_EXP_WEB_PLATFORM}
        </SwitchItem>
        <SwitchItem
          note={Messages.VIZALITY_SETTINGS_DISCORD_EXPERIMENTS_DESC.format()}
          value={getSetting('experiments', false)}
          onChange={() => {
            toggleSetting('experiments');
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
