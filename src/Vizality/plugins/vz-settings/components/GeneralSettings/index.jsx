const { remote } = require('electron');
const { React, getModule, i18n: { Messages } } = require('vizality/webpack');
const { Icons: { FontAwesome } } = require('vizality/components');
const { open: openModal, close: closeModal } = require('vizality/modal');
const { TextInput, SwitchItem, ButtonItem, Category } = require('vizality/components/settings');
const { Confirm } = require('vizality/components/modal');
const { WEBSITE, CACHE_FOLDER } = require('vizality/constants');
const { rmdirRf } = require('vizality/util');

module.exports = class GeneralSettings extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      discordCleared: false,
      vizalityCleared: false
    };
  }

  render () {
    const { getSetting, toggleSetting, updateSetting } = this.props;

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
              this.askRestart();
            }}
          >
            {Messages.VIZALITY_SETTINGS_DEBUG_LOGS}
          </SwitchItem>
          {vizality.api.labs.isExperimentEnabled('vz-sdk')
            ? <SwitchItem
              note={'Vizality\'s SDK is a toolkit made to make plugin and theme developer\'s life easier. Once enabled, you can access it through the icon at the top right hand corner of Discord.'}
              value={getSetting('sdkEnabled', false)}
              onChange={() => toggleSetting('sdkEnabled')}
            >
              Enable Vizality SDK
            </SwitchItem>
            : <SwitchItem
              note={Messages.VIZALITY_SETTINGS_OVERLAY_DESC}
              value={getSetting('openOverlayDevTools', false)}
              onChange={() => toggleSetting('openOverlayDevTools')}
            >
              {Messages.VIZALITY_SETTINGS_OVERLAY}
            </SwitchItem>}
          {/* @todo: remove this and associated things like strings */}
          {/* <SwitchItem
            note={Messages.VIZALITY_SETTINGS_KEEP_TOKEN_DESC}
            value={getSetting('hideToken', true)}
            onChange={() => toggleSetting('hideToken', true)}
          >
            {Messages.VIZALITY_SETTINGS_KEEP_TOKEN}
          </SwitchItem> */}
          <SwitchItem
            disabled={!!window.GlasscordApi}
            note={window.GlasscordApi
              ? Messages.VIZALITY_SETTINGS_TRANSPARENT_GLASSCORD.format({ glasscordCfgUrl: 'https://github.com/AryToNeX/Glasscord#how-do-i-use-it' })
              : Messages.VIZALITY_SETTINGS_TRANSPARENT_DESC.format()}
            value={getSetting('transparentWindow', false)}
            onChange={() => {
              toggleSetting('transparentWindow');
              this.askRestart();
            }}
          >
            {Messages.VIZALITY_SETTINGS_TRANSPARENT}
          </SwitchItem>
          <SwitchItem
            note={Messages.VIZALITY_SETTINGS_EXP_WEB_PLATFORM_DESC.format()}
            value={getSetting('experimentalWebPlatform', false)}
            onChange={() => {
              toggleSetting('experimentalWebPlatform');
              this.askRestart();
            }}
          >
            {Messages.VIZALITY_SETTINGS_EXP_WEB_PLATFORM}
          </SwitchItem>
          <SwitchItem
            note={Messages.VIZALITY_SETTINGS_DISCORD_EXPERIMENTS_DESC.format()}
            value={getSetting('experiments', false)}
            onChange={async () => {
              toggleSetting('experiments');
              // Update modules
              const experimentsModule = await getModule(r => r.isDeveloper !== void 0);
              experimentsModule._changeCallbacks.forEach(cb => cb());
            }}
          >
            {Messages.VIZALITY_SETTINGS_DISCORD_EXPERIMENTS}
          </SwitchItem>
          {/* @todo: remove this and associated things like strings */}
          {/* <TextInput
            value={getSetting('backendURL', WEBSITE)}
            onChange={p => updateSetting('backendURL', !p ? WEBSITE : p)}
            note={Messages.VIZALITY_SETTINGS_BACKEND_DESC}
          >
            {Messages.VIZALITY_SETTINGS_BACKEND}
          </TextInput> */}
        </Category>
        <ButtonItem
          note={Messages.VIZALITY_SETTINGS_CACHE_VIZALITY_DESC}
          button={this.state.vizalityCleared ? Messages.VIZALITY_SETTINGS_CACHE_CLEARED : Messages.VIZALITY_SETTINGS_CACHE_VIZALITY}
          success={this.state.vizalityCleared}
          onClick={() => this.clearVizalityCache()}
        >
          {Messages.VIZALITY_SETTINGS_CACHE_VIZALITY}
        </ButtonItem>
        <ButtonItem
          note={Messages.VIZALITY_SETTINGS_CACHE_DISCORD_DESC}
          button={this.state.discordCleared ? Messages.VIZALITY_SETTINGS_CACHE_CLEARED : Messages.VIZALITY_SETTINGS_CACHE_DISCORD}
          success={this.state.discordCleared}
          onClick={() => this.clearDiscordCache()}
        >
          {Messages.VIZALITY_SETTINGS_CACHE_DISCORD}
        </ButtonItem>
      </div>
    );
  }

  clearDiscordCache () {
    this.setState({ discordCleared: true });
    remote.getCurrentWindow().webContents.session.clearCache(() => void 0);
    setTimeout(() => {
      this.setState({ discordCleared: false });
    }, 2500);
  }

  clearVizalityCache () {
    this.setState({ vizalityCleared: true });
    rmdirRf(CACHE_FOLDER);
    setTimeout(() => {
      this.setState({ vizalityCleared: false });
    }, 2500);
  }

  askRestart () {
    openModal(() => <Confirm
      red
      header={Messages.ERRORS_RESTART_APP}
      confirmText={Messages.BUNDLE_READY_RESTART}
      cancelText={Messages.BUNDLE_READY_LATER}
      onConfirm={() => window.reloadElectronApp()}
      onCancel={closeModal}
    >
      <div className='vizality-text'>
        {Messages.VIZALITY_SETTINGS_RESTART}
      </div>
    </Confirm>);
  }
};
