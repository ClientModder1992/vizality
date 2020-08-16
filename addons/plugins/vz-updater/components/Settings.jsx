const { settings: { SwitchItem, TextInput, Category, ButtonItem }, Icons: { FontAwesome }, Clickable, Button, FormNotice, FormTitle, Tooltip } = require('@components');
const { React, getModule, i18n: { Messages, chosenLocale: currentLocale } } = require('@webpack');
const { open: openModal, close: closeModal } = require('vizality/modal');
const { joinClassNames, time } = require('@utilities');
const { REPO: { VIZALITY_REPO }, DIR: { CACHE_DIR } } = require('@constants');
const { Confirm } = require('@components/modal');

const { readdirSync, existsSync } = require('fs');
const { clipboard } = require('electron');

const Update = require('./Update');
const Icons = require('./Icons');

class UpdaterSettings extends React.PureComponent {
  constructor () {
    super();
    this.plugin = vizality.manager.plugins.get('vz-updater');
    this.state = {
      opened: false,
      copied: false
    };
  }

  render () {
    const isUnsupported = window.GLOBAL_ENV.RELEASE_CHANNEL !== 'stable';
    // @todo: Make this be in its own store
    const awaitingReload = this.props.getSetting('awaiting_reload', false);
    const updating = this.props.getSetting('updating', false);
    const checking = this.props.getSetting('checking', false);
    const disabled = this.props.getSetting('disabled', false);
    const paused = this.props.getSetting('paused', false);
    const failed = this.props.getSetting('failed', false);

    const updates = this.props.getSetting('updates', []);
    const disabledEntities = this.props.getSetting('entities_disabled', []);
    const checkingProgress = this.props.getSetting('checking_progress', [ 0, 0 ]);
    const last = time(this.props.getSetting('last_check', false)).calendar();

    let icon,
      title;
    if (disabled) {
      icon = <Icons.Update color='#f04747'/>;
      title = Messages.VIZALITY_UPDATES_DISABLED;
    } else if (paused) {
      icon = <Icons.Paused/>;
      title = Messages.VIZALITY_UPDATES_PAUSED;
    } else if (checking) {
      icon = <Icons.Update color='#7289da' animated/>;
      title = Messages.VIZALITY_UPDATES_CHECKING;
    } else if (updating) {
      icon = <Icons.Update color='#7289da' animated/>;
      title = Messages.VIZALITY_UPDATES_UPDATING;
    } else if (failed) {
      icon = <Icons.Error/>;
      title = Messages.VIZALITY_UPDATES_FAILED;
    } else if (updates.length > 0) {
      icon = <Icons.Update/>;
      title = Messages.VIZALITY_UPDATES_AVAILABLE;
    } else {
      icon = <Icons.UpToDate/>;
      title = Messages.VIZALITY_UPDATES_UP_TO_DATE;
    }

    const { colorStandard } = getModule('colorStandard');

    return <div className={`vizality-updater ${colorStandard}`}>
      {awaitingReload
        ? this.renderReload()
        : isUnsupported && this.renderUnsupported()}
      <div className='top-section'>
        <div className='icon'>{icon}</div>
        <div className='status'>
          <h3>{title}</h3>
          {!disabled && !updating && (!checking || checkingProgress[1] > 0) && <div>
            {paused
              ? Messages.VIZALITY_UPDATES_PAUSED_RESUME
              : checking
                ? Messages.VIZALITY_UPDATES_CHECKING_STATUS.format({
                  checked: checkingProgress[0],
                  total: checkingProgress[1]
                })
                : Messages.VIZALITY_UPDATES_LAST_CHECKED.format({ date: last })}
          </div>}
        </div>
        <div className="about">
          <div>
            <span>{Messages.VIZALITY_UPDATES_UPSTREAM}</span>
            <span>{vizality.git.upstream.replace(VIZALITY_REPO, Messages.VIZALITY_UPDATES_UPSTREAM_OFFICIAL)}</span>
          </div>
          <div>
            <span>{Messages.VIZALITY_UPDATES_REVISION}</span>
            <span>{vizality.git.revision.substring(0, 7)}</span>
          </div>
          <div>
            <span>{Messages.VIZALITY_UPDATES_BRANCH}</span>
            <span>{vizality.git.branch}</span>
          </div>
        </div>
      </div>
      <div className='buttons'>
        {disabled || paused
          ? <Button
            size={Button.Sizes.SMALL}
            color={Button.Colors.GREEN}
            onClick={() => {
              this.props.updateSetting('paused', false);
              this.props.updateSetting('disabled', false);
            }}
          >
            {disabled ? Messages.VIZALITY_UPDATES_ENABLE : Messages.VIZALITY_UPDATES_RESUME}
          </Button>
          : (!checking && !updating && <>
            {updates.length > 0 && <Button
              size={Button.Sizes.SMALL}
              color={failed ? Button.Colors.RED : Button.Colors.GREEN}
              onClick={() => failed ? this.plugin.askForce() : this.plugin.doUpdate()}
            >
              {failed ? Messages.VIZALITY_UPDATES_FORCE : Messages.VIZALITY_UPDATES_UPDATE}
            </Button>}
            <Button
              size={Button.Sizes.SMALL}
              onClick={() => this.plugin.checkForUpdates(true)}
            >
              {Messages.VIZALITY_UPDATES_CHECK}
            </Button>
            <Button
              size={Button.Sizes.SMALL}
              color={Button.Colors.YELLOW}
              onClick={() => this.askPauseUpdates()}
            >
              {Messages.VIZALITY_UPDATES_PAUSE}
            </Button>
            <Button
              size={Button.Sizes.SMALL}
              color={Button.Colors.RED}
              onClick={() => this.askDisableUpdates(true, () => this.props.updateSetting('disabled', true))}
            >
              {Messages.VIZALITY_UPDATES_DISABLE}
            </Button>
          </>)}
      </div>
      {!disabled && !paused && !checking && updates.length > 0 && <div className='updates'>
        {updates.map(update => <Update
          {...update}
          key={update.id}
          updating={updating}
          onSkip={() => this.askSkipUpdate(() => this.plugin.skipUpdate(update.id, update.commits[0].id))}
          onDisable={() => this.askDisableUpdates(false, () => this.plugin.disableUpdates(update))}
        />)}
      </div>}

      {disabledEntities.length > 0 && <Category
        name={Messages.VIZALITY_UPDATES_DISABLED_SECTION}
        opened={this.state.opened}
        onChange={() => this.setState({ opened: !this.state.opened })}
      >
        {disabledEntities.map(entity => <div key={entity.id} className='update'>
          <div className='title'>
            <div className='icon'>
              <Tooltip text={entity.icon} position='left'>
                {React.createElement(Icons[entity.icon])}
              </Tooltip>
            </div>
            <div className='name'>{entity.name}</div>
            <div className='actions'>
              <Button color={Button.Colors.GREEN} onClick={() => this.plugin.enableUpdates(entity.id)}>
                {Messages.VIZALITY_UPDATES_ENABLE}
              </Button>
            </div>
          </div>
        </div>)}
      </Category>}
      <FormTitle className='vizality-updater-ft'>{Messages.OPTIONS}</FormTitle>
      {!disabled && <>
        <SwitchItem
          value={this.props.getSetting('automatic', false)}
          onChange={() => this.props.toggleSetting('automatic')}
          note={Messages.VIZALITY_UPDATES_OPTS_AUTO_DESC}
        >
          {Messages.VIZALITY_UPDATES_OPTS_AUTO}
        </SwitchItem>
        <TextInput
          note={Messages.VIZALITY_UPDATES_OPTS_INTERVAL_DESC}
          onChange={val => this.props.updateSetting('interval', (Number(val) && Number(val) >= 10) ? Math.ceil(Number(val)) : 10, 15)}
          defaultValue={this.props.getSetting('interval', 15)}
          required={true}
        >
          {Messages.VIZALITY_UPDATES_OPTS_INTERVAL}
        </TextInput>
        <ButtonItem
          note={Messages.VIZALITY_UPDATES_OPTS_CHANGE_LOGS_DESC}
          button={Messages.VIZALITY_UPDATES_OPTS_CHANGE_LOGS}
          onClick={() => this.plugin.openChangelogs()}
        >
          {Messages.VIZALITY_UPDATES_OPTS_CHANGE_LOGS}
        </ButtonItem>
        <Category
          name={Messages.VIZALITY_UPDATES_OPTS_DEBUG}
          description={Messages.VIZALITY_UPDATES_OPTS_DEBUG_DESC}
          opened={this.state.debugInfoOpened}
          onChange={() => this.setState({ debugInfoOpened: !this.state.debugInfoOpened })}
        >
          {this.renderDebugInfo(time)}
        </Category>
      </>}
    </div>;
  }

  // --- PARTS
  renderReload () {
    const body = <>
      <p>{Messages.VIZALITY_UPDATES_AWAITING_RELOAD_DESC}</p>
      <Button
        size={Button.Sizes.SMALL}
        color={Button.Colors.YELLOW}
        look={Button.Looks.INVERTED}
        onClick={() => location.reload()}
      >
        {Messages.ERRORS_RELOAD}
      </Button>
    </>;
    return this._renderFormNotice(Messages.VIZALITY_UPDATES_AWAITING_RELOAD_TITLE, body);
  }

  renderUnsupported () {
    const body = <p>
      {Messages.VIZALITY_UPDATES_UNSUPPORTED_DESC.format({ releaseChannel: window.GLOBAL_ENV.RELEASE_CHANNEL })}
    </p>;
    return this._renderFormNotice(Messages.VIZALITY_UPDATES_UNSUPPORTED_TITLE, body);
  }

  _renderFormNotice (title, body) {
    return <FormNotice
      imageData={{
        width: 60,
        height: 60,
        src: '/assets/0694f38cb0b10cc3b5b89366a0893768.svg'
      }}
      type={FormNotice.Types.WARNING}
      title={title}
      body={body}
    />;
  }

  // --- PROMPTS
  askSkipUpdate (callback) {
    this._ask(
      Messages.VIZALITY_UPDATES_SKIP_MODAL_TITLE,
      Messages.VIZALITY_UPDATES_SKIP_MODAL,
      Messages.VIZALITY_UPDATES_SKIP,
      callback
    );
  }

  askPauseUpdates () {
    this._ask(
      Messages.VIZALITY_UPDATES_PAUSE,
      Messages.VIZALITY_UPDATES_PAUSE_MODAL,
      Messages.VIZALITY_UPDATES_PAUSE,
      () => this.props.updateSetting('paused', true)
    );
  }

  askDisableUpdates (all, callback) {
    this._ask(
      Messages.VIZALITY_UPDATES_DISABLE,
      all ? Messages.VIZALITY_UPDATES_DISABLE_MODAL_ALL : Messages.VIZALITY_UPDATES_DISABLE_MODAL,
      Messages.VIZALITY_UPDATES_DISABLE,
      callback
    );
  }

  askChangeChannel (callback) {
    this._ask(
      Messages.VIZALITY_UPDATES_OPTS_RELEASE_MODAL_HEADER,
      Messages.VIZALITY_UPDATES_OPTS_RELEASE_MODAL,
      Messages.VIZALITY_UPDATES_OPTS_RELEASE_SWITCH,
      callback
    );
  }

  _ask (title, content, confirm, callback, red = true) {
    const { colorStandard } = getModule('colorStandard');

    openModal(() => <Confirm
      red={red}
      header={title}
      confirmText={confirm}
      cancelText={Messages.CANCEL}
      onConfirm={callback}
      onCancel={closeModal}
    >
      <div className={colorStandard}>{content}</div>
    </Confirm>);
  }

  // --- DEBUG STUFF (Intentionally left english-only)
  renderDebugInfo (time) {
    const { getRegisteredExperiments, getExperimentOverrides } = getModule('initialize', 'getExperimentOverrides');
    const { manager: { apis: { apis } }, api: { commands: { commands }, settings: { store: settingsStore } } } = vizality;
    const superProperties = getModule('getSuperPropertiesBase64').getSuperProperties();
    const plugins = vizality.manager.plugins.getAll().filter(plugin =>
      !vizality.manager.plugins.isInternal(plugin) && vizality.manager.plugins.isEnabled(plugin)
    );

    const experimentOverrides = Object.keys(getExperimentOverrides()).length;
    const availableExperiments = Object.keys(getRegisteredExperiments()).length;

    const discordPath = process.resourcesPath.slice(0, -10);
    const maskPath = (path) => {
      path = path.replace(/(?:\/home\/|C:\\Users\\|\/Users\/)([ \w.-]+).*/, (path, username) => {
        const usernameIndex = path.indexOf(username);
        return [ path.slice(0, usernameIndex), username.charAt(0) + username.slice(1).replace(/[a-zA-Z]/g, '*'),
          path.slice(usernameIndex + username.length) ].join('');
      });

      return path;
    };

    const cachedFiles = (existsSync(CACHE_DIR) && readdirSync(CACHE_DIR)
      .map(d => readdirSync(`${CACHE_DIR}/${d}`))
      .flat().length) || 'n/a';

    const createPathReveal = (title, path) =>
      <div className='full-column'>
        {title}:&#10;<a
          onMouseEnter={() => this.setState({ pathsRevealed: true })}
          onMouseLeave={() => this.setState({ pathsRevealed: false })}
          onClick={() => window.DiscordNative.fileManager.showItemInFolder(path)}
        >{this.state.pathsRevealed ? path : maskPath(path)}</a>
      </div>;

    return <FormNotice
      type={FormNotice.Types.PRIMARY}
      body={<div className={ joinClassNames('vizality-debug-info', { copied: this.state.copied })}>
        <code>
          <b>System / Discord</b>
          <div className='row'>
            <div className='column'>Locale:&#10;{currentLocale}</div>
            <div className='column'>OS:&#10;{(window.platform.os).toString()}</div>
            <div className='column'>Architecture:&#10;{superProperties.os_arch}</div>
            {process.platform === 'linux' && (
              <div className='column'>Distro:&#10;{superProperties.distro}</div>
            )}
            <div className='column'>Release Channel:&#10;{superProperties.release_channel}</div>
            <div className='column'>App Version:&#10;{superProperties.client_version}</div>
            <div className='column'>Build Number:&#10;{superProperties.client_build_number}</div>
            <div className='column'>Build ID:&#10;{window.GLOBAL_ENV.SENTRY_TAGS.buildId}</div>
            <div className='column'>Experiments:&#10;{experimentOverrides} / {availableExperiments}</div>
          </div>

          <b>Process Versions</b>
          <div className='row'>
            <div className='column'>React:&#10;{React.version}</div>
            {[ 'electron', 'chrome', 'node' ].map(proc =>
              <div className='column'>{proc.charAt(0).toUpperCase() + proc.slice(1)}:&#10;{process.versions[proc]}</div>
            )}
          </div>

          <b>Vizality</b>
          <div className='row'>
            <div className='column'>Commands:&#10;{Object.keys(commands).length}</div>
            <div className='column'>Settings:&#10;{Object.keys(settingsStore.getAllSettings()).length}</div>
            <div className='column'>Plugins:&#10;{vizality.manager.plugins.getAll()
              .filter(plugin => vizality.manager.plugins.isEnabled(plugin)).length} / {vizality.manager.plugins.size}
            </div>
            <div className='column'>Themes:&#10;{vizality.styleManager.getThemes()
              .filter(theme => vizality.styleManager.isEnabled(theme)).length} / {vizality.styleManager.themes.size}
            </div>
            <div className='column'>{`Settings Sync:\n${vizality.settings.get('settingsSync', false)}`}</div>
            <div className='column'>Cached Files:&#10;{cachedFiles}</div>
            <div className='column'>{`Account:\n${!!vizality.account}`}</div>
            <div className='column'>APIs:&#10;{apis.length}</div>
          </div>

          <b>Git</b>
          <div className='row'>
            <div className='column'>Upstream:&#10;{vizality.git.upstream.replace(VIZALITY_REPO, 'Official')}</div>
            <div className='column'>Revision:&#10;
              <a
                href={`https://github.com/${vizality.git.upstream}/commit/${vizality.git.revision}`}
                target='_blank'
              >
                [{vizality.git.revision.substring(0, 7)}]
              </a>
            </div>
            <div className='column'>Branch:&#10;{vizality.git.branch}</div>
            <div className='column'>{`Latest:\n${!this.props.getSetting('updates', []).find(update => update.id === 'vizality')}`}</div>
          </div>

          <b>Listings</b>
          <div className='row'>
            {createPathReveal('Vizality Path', vizality.basePath)}
            {createPathReveal('Discord Path', discordPath)}
            <div className='full-column'>Experiments:&#10;{experimentOverrides ? Object.keys(getExperimentOverrides()).join(', ') : 'n/a'}</div>
            <div className='full-column'>
            Plugins:&#10;
              {(plugins.length > 6 ? `${(this.state.pluginsRevealed ? plugins : plugins.slice(0, 6)).join(', ')}` : plugins.join(', ')) || 'n/a'}&nbsp;
              {plugins.length > 6 &&
              <Clickable tag='a' onClick={() => this.setState({ pluginsRevealed: !this.state.pluginsRevealed })}>
                {this.state.pluginsRevealed ? 'Show less' : 'Show more'}
              </Clickable>}
            </div>
          </div>
        </code>
        <Button
          size={Button.Sizes.SMALL}
          color={this.state.copied ? Button.Colors.GREEN : Button.Colors.BRAND}
          onClick={() => this.handleDebugInfoCopy(time, plugins)}
        >
          <FontAwesome icon={this.state.copied ? 'clipboard-check' : 'clipboard'}/> {this.state.copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>}
    />;
  }

  handleDebugInfoCopy (time, plugins) {
    const extract = document.querySelector('.vizality-debug-info > code')
      .innerText.replace(/([A-Z/ ]+) (?=\s(?!C:\\).*?:)/g, '\n[$1]').replace(/(.*?):\s(.*.+)/g, '$1="$2"').replace(/[ -](\w*(?=.*=))/g, '$1');

    this.setState({ copied: true });
    clipboard.writeText(
      `\`\`\`ini
      # Debugging Information | Result created: ${time().calendar()}
      ${extract.substring(0, extract.indexOf('\nPlugins', extract.indexOf('\nPlugins') + 1))}
      Plugins="${plugins.join(', ')}"
      \`\`\``.replace(/ {6}|n\/a/g, '').replace(/(?![0-9]{1,3}) \/ (?=[0-9]{1,3})/g, '/')
    );
    setTimeout(() => this.setState({ copied: false }), 2500);
  }
}

module.exports = UpdaterSettings;
