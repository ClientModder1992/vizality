import React, { memo, useState } from 'react';

import { TextInput, SwitchItem, ButtonItem, Category } from '@vizality/components/settings';
import { removeDirRecursive } from '@vizality/util/file';
import { Directories } from '@vizality/constants';
import { getModule } from '@vizality/webpack';
import { Icon } from '@vizality/components';
import { Messages } from '@vizality/i18n';

export default memo(({ getSetting, toggleSetting, updateSetting }) => {
  const [ isDiscordCacheCleared, setDiscordCacheCleared ] = useState(false);
  const [ isVizalityCacheCleared, setVizalityCacheCleared ] = useState(false);

  const clearDiscordCache = () => {
    setDiscordCacheCleared(true);
    vizality.native.app.clearCache().then(() => {
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

  return (
    <div>
      <TextInput
        defaultValue={getSetting('commandPrefix', '.')}
        onChange={p => updateSetting('commandPrefix', !p ? '.' : p.replace(/\s+(?=\S)|(?<=\s)\s+/g, '').toLowerCase())}
        onBlur={({ target }) => target.value = getSetting('commandPrefix', '.')}
        error={getSetting('commandPrefix', '.') === '/' ? 'Prefix should not be set to `/` as it is already in use by Discord and may disable Vizality autocompletions.' : ''}
      >
        {Messages.VIZALITY_COMMAND_PREFIX}
      </TextInput>
      <SwitchItem
        note={Messages.VIZALITY_SETTINGS_NO_CLYDE_DESC.format({ discordiaUrl: 'https://discordia.me/clyde', apiUrl:  `${window.location.origin}/vizality/docs` })}
        value={getSetting('replaceClyde', true)}
        onChange={() => {
          try {
            toggleSetting('replaceClyde', true);
          } catch (err) {
            console.log(err);
          }
        }}
      >
        <Icon
          className='vz-settings-eradicate-clyde-icon-wrapper'
          iconClassName='vz-settings-eradicate-clyde-icon'
          name='Robot'
          size='20px'
        />
        {Messages.VIZALITY_SETTINGS_NO_CLYDE}
      </SwitchItem>
      <SwitchItem
        note={Messages.VIZALITY_SETTINGS_SMOOTH_SCROLLING_DESC.format()}
        value={getSetting('smoothScrolling', true)}
        onChange={() => {
          toggleSetting('smoothScrolling', true);
          vizality.api.actions.invokeAction('CONFIRM_RESTART');
        }}
      >
        {Messages.VIZALITY_SETTINGS_SMOOTH_SCROLLING}
      </SwitchItem>
      <Category
        name={Messages.ADVANCED_SETTINGS}
        description={Messages.VIZALITY_SETTINGS_ADVANCED_DESC}
        opened={getSetting('advancedSettings', false)}
        onChange={() => toggleSetting('advancedSettings')}
      >
        <SwitchItem
          note={Messages.VIZALITY_SETTINGS_REACT_DEVELOPER_TOOLS_DESC.format()}
          value={getSetting('reactDeveloperTools', false)}
          onChange={() => {
            toggleSetting('reactDeveloperTools', false);
            vizality.api.actions.invokeAction('CONFIRM_RESTART');
          }}
        >
          {Messages.VIZALITY_SETTINGS_REACT_DEVELOPER_TOOLS}
        </SwitchItem>
        <SwitchItem
          note='Enables live reload for folder/file changes for plugins.'
          value={getSetting('hotReload', false)}
          onChange={async () => {
            toggleSetting('hotReload', false);
            await vizality.manager.plugins.remountAll();
          }}
        >
          Enable Hot Reload
        </SwitchItem>
        {/* <SwitchItem
          note={Messages.VIZALITY_SETTINGS_DEBUG_LOGS_DESC}
          value={getSetting('debugLogs', false)}
          onChange={() => {
            toggleSetting('debugLogs');
            confirmRestart();
          }}
        >
          {Messages.VIZALITY_SETTINGS_DEBUG_LOGS}
        </SwitchItem> */}
        {/* <SwitchItem
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
        </SwitchItem> */}
        <SwitchItem
          note={Messages.VIZALITY_SETTINGS_KEEP_TOKEN_DESC}
          value={getSetting('hideToken', true)}
          onChange={() => toggleSetting('hideToken', true)}
        >
          {Messages.VIZALITY_SETTINGS_KEEP_TOKEN}
        </SwitchItem>
        <SwitchItem
          note={Messages.VIZALITY_SETTINGS_TRANSPARENT_DESC.format()}
          value={getSetting('transparentWindow', false)}
          onChange={() => {
            toggleSetting('transparentWindow');
            vizality.api.actions.invokeAction('CONFIRM_RESTART');
          }}
        >
          {Messages.VIZALITY_SETTINGS_TRANSPARENT}
        </SwitchItem>
        <SwitchItem
          note={Messages.VIZALITY_SETTINGS_EXP_WEB_PLATFORM_DESC.format()}
          value={getSetting('experimentalWebPlatform', false)}
          onChange={() => {
            toggleSetting('experimentalWebPlatform');
            vizality.api.actions.invokeAction('CONFIRM_RESTART');
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
