import React, { memo, useState } from 'react';
import { readdirSync, existsSync } from 'fs';
import { clipboard } from 'electron';

import { SwitchItem, TextInput, Category, FormTitle } from '@vizality/components/settings';
import { Confirm, Clickable, Button, FormNotice } from '@vizality/components';
import { open as openModal, close as closeModal } from '@vizality/modal';
import { Repositories, Directories } from '@vizality/constants';
import { Messages, chosenLocale } from '@vizality/i18n';
import { joinClassNames } from '@vizality/util';
import { getModule } from '@vizality/webpack';

import Update from './Update';
import Icons from './Icons';

export default memo(({ getSetting, toggleSetting, updateSetting }) => {
  const [ opened, setOpened ] = useState(false);
  const [ copyText, setCopyText ] = useState(Messages.COPY);
  const [ debugInfoOpened, setDebugInfoOpened ] = useState();
  const [ pathsRevealed, setPathsRevealed ] = useState();
  const [ pluginsRevealed, setPluginsRevealed ] = useState();

  // eslint-disable-next-line consistent-this
  const _this = vizality.manager.builtins.get('updater');

  const isUnsupported = window.GLOBAL_ENV.RELEASE_CHANNEL !== 'stable';
  const time = getModule('momentProperties');
  // @todo: Make this be in its own store
  const awaitingReload = getSetting('awaiting_reload', false);
  const updating = getSetting('updating', false);
  const checking = getSetting('checking', false);
  const disabled = getSetting('disabled', false);
  const paused = getSetting('paused', false);
  const failed = getSetting('failed', false);

  const updates = getSetting('updates', []);
  const disabledAddons = getSetting('addons_disabled', []);
  const checkingProgress = getSetting('checking_progress', [ 0, 0 ]);
  const last = time(getSetting('last_check', false)).calendar();

  let icon, title;
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

  const _renderFormNotice = (title, body) => {
    const { marginBottom20 } = getModule('marginBottom20');
    return <FormNotice
      className={joinClassNames('vz-updater-form-notice', marginBottom20)}
      imageData={{
        width: 60,
        height: 60,
        src: '/assets/0694f38cb0b10cc3b5b89366a0893768.svg'
      }}
      type={FormNotice.Types.WARNING}
      title={title}
      body={body}
    />;
  };

  // --- PARTS
  const renderReload = () => {
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
    return _renderFormNotice(Messages.VIZALITY_UPDATES_AWAITING_RELOAD_TITLE, body);
  };

  const renderUnsupported = () => {
    const body = <p>
      {Messages.VIZALITY_UPDATES_UNSUPPORTED_DESC.format({ releaseChannel: window.GLOBAL_ENV.RELEASE_CHANNEL })}
    </p>;
    return _renderFormNotice(Messages.VIZALITY_UPDATES_UNSUPPORTED_TITLE, body);
  };

  const _ask = (title, content, confirm, callback, red = true) => {
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
  };

  // --- PROMPTS
  const askSkipUpdate = (callback) => {
    _ask(
      Messages.VIZALITY_UPDATES_SKIP_MODAL_TITLE,
      Messages.VIZALITY_UPDATES_SKIP_MODAL,
      Messages.VIZALITY_UPDATES_SKIP,
      callback
    );
  };

  const askPauseUpdates = () => {
    _ask(
      Messages.VIZALITY_UPDATES_PAUSE,
      Messages.VIZALITY_UPDATES_PAUSE_MODAL,
      Messages.VIZALITY_UPDATES_PAUSE,
      () => updateSetting('paused', true)
    );
  };

  const askDisableUpdates = (all, callback) => {
    _ask(
      Messages.VIZALITY_UPDATES_DISABLE,
      all ? Messages.VIZALITY_UPDATES_DISABLE_MODAL_ALL : Messages.VIZALITY_UPDATES_DISABLE_MODAL,
      Messages.VIZALITY_UPDATES_DISABLE,
      callback
    );
  };

  const handleDebugInfoCopy = (time, plugins) => {
    const extract = document.querySelector('.vizality-debug-info > code')
      .innerText.replace(/([A-Z/ ]+) (?=\s(?!C:\\).*?:)/g, '\n[$1]').replace(/(.*?):\s(.*.+)/g, '$1="$2"').replace(/[ -](\w*(?=.*=))/g, '$1');

    setCopyText(Messages.COPIED);
    clipboard.writeText(
      `\`\`\`ini
      # Debugging Information | Result created: ${time().calendar()}
      ${extract.substring(0, extract.indexOf('\nPlugins', extract.indexOf('\nPlugins') + 1))}
      Plugins="${plugins.join(', ')}"
      \`\`\``.replace(/ {6}|n\/a/g, '').replace(/(?![0-9]{1,3}) \/ (?=[0-9]{1,3})/g, '/')
    );
    setTimeout(() => setCopyText(Messages.COPY), 2500);
  };

  // --- DEBUG STUFF (Intentionally left english-only)
  const renderDebugInfo = (time) => {
    const { getRegisteredExperiments, getExperimentOverrides } = getModule('initialize', 'getExperimentOverrides');
    const { manager: { apis: { apis } }, api: { commands: { commands }, settings: { store: settingsStore } } } = vizality;
    const superProperties = getModule('getSuperPropertiesBase64').getSuperProperties();
    const plugins = vizality.manager.plugins.getAllEnabled();

    const experimentOverrides = Object.keys(getExperimentOverrides()).length;
    const availableExperiments = Object.keys(getRegisteredExperiments()).length;

    const discordPath = process.resourcesPath.slice(0, -10);
    const maskPath = (path) => {
      path = path.replace(/(?:\/home\/|C:\\Users\\|\/Users\/)([ \w.-]+).*/i, (path, username) => {
        const usernameIndex = path.indexOf(username);
        return [ path.slice(0, usernameIndex), username.charAt(0) + username.slice(1).replace(/[a-zA-Z]/g, '*'),
          path.slice(usernameIndex + username.length) ].join('');
      });

      return path;
    };

    const cachedFiles = (existsSync(Directories.CACHE) && readdirSync(Directories.CACHE)
      .map(d => readdirSync(`${Directories.CACHE}/${d}`))
      .flat().length) || 'n/a';

    const createPathReveal = (title, path) =>
      <div className='full-column'>
        {title}:&#10;<a
          onMouseEnter={() => setPathsRevealed(true)}
          onMouseLeave={() => setPathsRevealed(false)}
          onClick={() => window.DiscordNative.fileManager.showItemInFolder(path)}
        >{pathsRevealed ? path : maskPath(path)}</a>
      </div>;

    return <FormNotice
      type={FormNotice.Types.PRIMARY}
      body={<div className={ joinClassNames('vizality-debug-info', { copied: copyText === Messages.COPIED })}>
        <code>
          <b>System / Discord</b>
          <div className='row'>
            <div className='column'>Locale:&#10;{chosenLocale}</div>
            <div className='column'>OS:&#10;{(window.platform.os).toString()}</div>
            <div className='column'>Architecture:&#10;{superProperties.os_arch}</div>
            {process.platform === 'linux' && (
              <div className='column'>Distro:&#10;{superProperties.distro || 'n/a'}</div>
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
            <div className='column'>Plugins:&#10;{vizality.manager.plugins.getAllEnabled().length} / {vizality.manager.plugins.count}
            </div>
            <div className='column'>Themes:&#10;{vizality.manager.themes.getAllEnabled().length} / {vizality.manager.themes.count}
            </div>
            <div className='column'>{`Settings Sync:\n${vizality.settings.get('settingsSync', false)}`}</div>
            <div className='column'>Cached Files:&#10;{cachedFiles}</div>
            <div className='column'>{`Account:\n${!!vizality.account}`}</div>
            <div className='column'>APIs:&#10;{apis.length}</div>
          </div>

          <b>Git</b>
          <div className='row'>
            <div className='column'>Upstream:&#10;{vizality.git.upstream.replace(Repositories.VIZALITY, 'Official')}</div>
            <div className='column'>Revision:&#10;
              <a
                href={`https://github.com/${vizality.git.upstream}/commit/${vizality.git.revision}`}
                target='_blank'
              >
                [{vizality.git.revision.substring(0, 7)}]
              </a>
            </div>
            <div className='column'>Branch:&#10;{vizality.git.branch}</div>
            <div className='column'>{`Latest:\n${!getSetting('updates', []).find(update => update.id === 'vizality')}`}</div>
          </div>

          <b>Listings</b>
          <div className='row'>
            {createPathReveal('Vizality Path', vizality.baseDir)}
            {createPathReveal('Discord Path', discordPath)}
            <div className='full-column'>Experiments:&#10;{experimentOverrides ? Object.keys(getExperimentOverrides()).join(', ') : 'n/a'}</div>
            <div className='full-column'>
            Plugins:&#10;
              {(plugins.length > 6 ? `${(pluginsRevealed ? plugins : plugins.slice(0, 6)).join(', ')}` : plugins.join(', ')) || 'n/a'}&nbsp;
              {plugins.length > 6 &&
              <Clickable tag='a' onClick={() => setPluginsRevealed(!pluginsRevealed)}>
                {pluginsRevealed ? 'Show less' : 'Show more'}
              </Clickable>}
            </div>
          </div>
        </code>
        <Button
          size={Button.Sizes.SMALL}
          color={copyText === Messages.COPIED ? Button.Colors.GREEN : Button.Colors.BRAND}
          onClick={() => handleDebugInfoCopy(time, plugins)}
        >
          {copyText}
        </Button>
      </div>}
    />;
  };

  return (
    <>
      {awaitingReload
        ? renderReload()
        : isUnsupported && renderUnsupported()}
      <div className='vz-updater-top-section'>
        <div className='vz-updater-top-section-header'>
          <div className='vz-updater-top-section-icon'>
            {icon}
          </div>
          <div className='vz-updater-top-section-status'>
            <h3 className='vz-updater-top-section-title'>
              {title}
            </h3>
            {!disabled && !updating && (!checking || checkingProgress[1] > 0) && <div className='vz-updater-top-section-subtitle'>
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
          <div className='vz-updater-top-section-about'>
            <div className='vz-updater-top-section-about-column'>
              <span className='vz-updater-top-section-about-title'>
                {Messages.VIZALITY_UPDATES_UPSTREAM}
              </span>
              <span className='vz-updater-top-section-about-title'>
                {Messages.VIZALITY_UPDATES_REVISION}
              </span>
              <span className='vz-updater-top-section-about-title'>
                {Messages.VIZALITY_UPDATES_BRANCH}
              </span>
            </div>
            <div className='vz-updater-top-section-about-column'>
              <span className='vz-updater-top-section-about-value'>
                {vizality.git.upstream.replace(Repositories.VIZALITY, Messages.VIZALITY_UPDATES_UPSTREAM_OFFICIAL)}
              </span>
              <span className='vz-updater-top-section-about-value'>
                {vizality.git.revision.substring(0, 7)}
              </span>
              <span className='vz-updater-top-section-about-value'>
                {vizality.git.branch}
              </span>
            </div>
          </div>
        </div>
        <div className='vz-updater-top-section-footer'>
          {disabled || paused
            ? <Button
              size={Button.Sizes.SMALL}
              color={Button.Colors.GREEN}
              onClick={() => {
                updateSetting('paused', false);
                updateSetting('disabled', false);
              }}
            >
              {disabled ? Messages.VIZALITY_UPDATES_ENABLE : Messages.VIZALITY_UPDATES_RESUME}
            </Button>
            : (!checking && !updating && <>
              {updates.length > 0 && <Button
                size={Button.Sizes.SMALL}
                color={failed ? Button.Colors.RED : Button.Colors.GREEN}
                onClick={() => failed ? _this.askForce() : _this.doUpdate()}
              >
                {failed ? Messages.VIZALITY_UPDATES_FORCE : Messages.VIZALITY_UPDATES_UPDATE}
              </Button>}
              <Button
                size={Button.Sizes.SMALL}
                onClick={() => _this.checkForUpdates(true)}
              >
                {Messages.VIZALITY_UPDATES_CHECK}
              </Button>
              <Button
                size={Button.Sizes.SMALL}
                color={Button.Colors.YELLOW}
                onClick={() => askPauseUpdates()}
              >
                {Messages.VIZALITY_UPDATES_PAUSE}
              </Button>
              <Button
                size={Button.Sizes.SMALL}
                color={Button.Colors.RED}
                onClick={() => askDisableUpdates(true, () => updateSetting('disabled', true))}
              >
                {Messages.VIZALITY_UPDATES_DISABLE}
              </Button>
            </>)}
        </div>
      </div>
      {!disabled && !paused && !checking && updates.length > 0 && <div className='vz-updater-updates'>
        <FormTitle className='vz-updater-updates-title'>
          Pending Updates
        </FormTitle>
        {updates.map(update => <Update
          {...update}
          key={update.id}
          updating={updating}
          onSkip={() => askSkipUpdate(() => _this.skipUpdate(update.id, update.commits[0].id))}
          onDisable={() => askDisableUpdates(false, () => _this.disableUpdates(update))}
        />)}
      </div>}
      {disabledAddons.length > 0 && <Category
        name={Messages.VIZALITY_UPDATES_DISABLED_SECTION}
        description={Messages.VIZALITY_UPDATES_DISABLED_SECTION_DESC}
        opened={opened}
        onChange={() => setOpened(!opened)}
      >
        {disabledAddons.map(addon => <Update
          {...addon}
          disabled={true}
          key={addon.id}
          updating={updating}
          onEnableUpdates={() => _this.enableUpdates(addon.id)}
        />)}
      </Category>}
      <div className='vz-updater-options'>
        <FormTitle className='vz-updater-options-title'>
          {Messages.OPTIONS}
        </FormTitle>
        {!disabled && <>
          <SwitchItem
            value={getSetting('automatic', false)}
            onChange={() => toggleSetting('automatic')}
            note={Messages.VIZALITY_UPDATES_OPTS_AUTO_DESC}
          >
            {Messages.VIZALITY_UPDATES_OPTS_AUTO}
          </SwitchItem>
          <TextInput
            note={Messages.VIZALITY_UPDATES_OPTS_INTERVAL_DESC}
            onChange={val => updateSetting('interval', (Number(val) && Number(val) >= 10) ? Math.ceil(Number(val)) : 10, 15)}
            defaultValue={getSetting('interval', 15)}
            required={true}
          >
            {Messages.VIZALITY_UPDATES_OPTS_INTERVAL}
          </TextInput>
          <Category
            name={Messages.VIZALITY_UPDATES_OPTS_DEBUG}
            description={Messages.VIZALITY_UPDATES_OPTS_DEBUG_DESC}
            opened={debugInfoOpened}
            onChange={() => setDebugInfoOpened(!debugInfoOpened)}
          >
            {renderDebugInfo(time)}
          </Category>
        </>}
      </div>
    </>
  );
});
