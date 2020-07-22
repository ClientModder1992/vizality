const { React, getModule, getModuleByDisplayName, i18n: { Messages } } = require('@webpack');
const { open: openModal, close: closeModal } = require('vizality/modal');
const changelog = require('@root/changelogs.json');
const { Confirm } = require('@components/modal');
const { ROOT_FOLDER } = require('@constants');
const { Plugin } = require('@entities');

const { promisify } = require('util');
const cp = require('child_process');
const exec = promisify(cp.exec);

const Settings = require('./components/Settings');

module.exports = class Updater extends Plugin {
  constructor () {
    super();

    this.checking = false;
    this.cwd = { cwd: ROOT_FOLDER };
  }

  async startPlugin () {
    console.log(this.cwd);
    this.settings.set('paused', false);
    this.settings.set('failed', false);
    this.settings.set('updating', false);
    this.settings.set('awaiting_reload', false);
    this.loadStylesheet('style.scss');
    vizality.api.settings.registerSettings('Updater', {
      category: this.entityID,
      label: 'Updater', // Note to self: add this string to i18n last :^)
      render: Settings
    });

    let minutes = Number(this.settings.get('interval', 15));
    if (minutes < 1) {
      this.settings.set('interval', 1);
      minutes = 1;
    }

    this._interval = setInterval(this.checkForUpdates.bind(this), minutes * 60 * 1000);
    this.checkForUpdates();

    const lastChangelog = this.settings.get('last_changelog', '');
    if (changelog.id !== lastChangelog) {
      this.openChangeLogs();
    }
  }

  pluginWillUnload () {
    vizality.api.settings.unregisterSettings('Updater');
    clearInterval(this._interval);
  }

  async checkForUpdates (allConcurrent = false) {
    if (
      this.settings.set('disabled', false) ||
      this.settings.set('paused', false) ||
      this.settings.set('checking', false) ||
      this.settings.set('updating', false)
    ) {
      return;
    }

    this.settings.set('checking', true);
    this.settings.set('checking_progress', [ 0, 0 ]);
    const disabled = this.settings.get('entities_disabled', []).map(e => e.id);
    const skipped = this.settings.get('entities_skipped', []);
    const plugins = [ ...vizality.pluginManager.plugins.values() ].filter(p => !p.isInternal);
    const themes = [ ...vizality.styleManager.themes.values() ].filter(t => t.isTheme);

    const entities = plugins.concat(themes).filter(e => !disabled.includes(e.updateIdentifier) && e.isUpdatable());
    if (!disabled.includes(vizality.updateIdentifier)) {
      entities.push(vizality);
    }

    let done = 0;
    const updates = [];
    const entitiesLength = entities.length;
    const parallel = allConcurrent ? entitiesLength : this.settings.get('concurrency', 2);
    await Promise.all(Array(parallel).fill(null).map(async () => {
      let entity;
      while ((entity = entities.shift())) {
        const repo = await entity.getGitRepo();
        if (repo) {
          const shouldUpdate = await entity._checkForUpdates();
          if (shouldUpdate) {
            const commits = await entity._getUpdateCommits();
            if (skipped[entity.updateIdentifier] === commits[0].id) {
              return;
            }
            updates.push({
              id: entity.updateIdentifier,
              name: entity.constructor.name,
              icon: entity.__proto__.__proto__.constructor.name.replace('Updatable', 'Vizality'),
              commits,
              repo
            });
          }
        }
        done++;
        this.settings.set('checking_progress', [ done, entitiesLength ]);
      }
    }));

    this.settings.set('updates', updates);
    this.settings.set('last_check', Date.now());
    this.settings.set('checking', false);
    if (updates.length > 0) {
      if (this.settings.get('automatic', false)) {
        this.doUpdate();
      } else if (!document.querySelector('#vizality-updater, .vizality-updater')) {
        vizality.api.notices.sendToast('vizality-updater', {
          header: Messages.VIZALITY_UPDATES_TOAST_AVAILABLE_HEADER,
          content: Messages.VIZALITY_UPDATES_TOAST_AVAILABLE_DESC,
          icon: 'wrench',
          buttons: [ {
            text: Messages.VIZALITY_UPDATES_UPDATE,
            color: 'green',
            look: 'outlined',
            onClick: () => this.doUpdate()
          }, {
            text: Messages.VIZALITY_UPDATES_OPEN_UPDATER,
            color: 'blue',
            look: 'ghost',
            onClick: () => {
              const settingsModule = getModule('open', 'saveAccountChanges');
              settingsModule.open('vz-updater');
            }
          } ]
        });
      }
    }
  }

  async doUpdate (force = false) {
    this.settings.set('failed', false);
    this.settings.set('updating', true);
    const updates = this.settings.get('updates', []);
    const failed = [];
    for (const update of [ ...updates ]) {
      let entity = vizality;
      if (update.id.startsWith('plugin')) {
        entity = vizality.pluginManager.get(update.id.replace('plugins_', ''));
      } else if (update.id.startsWith('theme')) {
        entity = vizality.styleManager.get(update.id.replace('themes_', ''));
      }

      const success = await entity._update(force);
      updates.shift();
      this.settings.get('updates', updates);
      if (!success) {
        failed.push(update);
      }
    }

    this.settings.set('updating', false);
    if (failed.length > 0) {
      this.settings.set('failed', true);
      this.settings.set('updates', failed);
      if (!document.querySelector('#vizality-updater, .vizality-updater')) {
        vizality.api.notices.sendToast('vizality-updater', {
          header: Messages.VIZALITY_UPDATES_TOAST_FAILED,
          type: 'error',
          buttons: [ {
            text: Messages.VIZALITY_UPDATES_FORCE,
            color: 'red',
            look: 'outlined',
            onClick: () => this.askForce()
          }, {
            text: Messages.FRIEND_REQUEST_IGNORE,
            look: 'outlined',
            color: 'grey'
          }, {
            text: Messages.VIZALITY_UPDATES_OPEN_UPDATER,
            color: 'blue',
            look: 'ghost',
            onClick: () => {
              const settingsModule = getModule('open', 'saveAccountChanges');
              settingsModule.open('vz-updater');
            }
          } ]
        });
      }
    }
  }

  // MODALS
  askForce (callback) {
    const { colorStandard } = getModule('colorStandard');

    openModal(() =>
      React.createElement(Confirm, {
        red: true,
        header: Messages.SUPPRESS_EMBED_TITLE,
        confirmText: Messages.VIZALITY_UPDATES_FORCE,
        cancelText: Messages.CANCEL,
        onConfirm: () => {
          if (callback) {
            // eslint-disable-next-line callback-return
            callback();
          }
          this.doUpdate(true);
        },
        onCancel: closeModal
      }, React.createElement('div', { className: colorStandard }, Messages.VIZALITY_UPDATES_FORCE_MODAL))
    );
  }

  // UTILS
  skipUpdate (id, commit) {
    this.settings.set('entities_skipped', {
      ...this.settings.get('entities_skipped', {}),
      [id]: commit
    });
    this._removeUpdate(id);
  }

  disableUpdates (entity) {
    this.settings.set('entities_disabled', [
      ...this.settings.get('entities_disabled', []),
      {
        id: entity.id,
        name: entity.name,
        icon: entity.icon
      }
    ]);
    this._removeUpdate(entity.id);
  }

  enableUpdates (id) {
    this.settings.set('entities_disabled', this.settings.get('entities_disabled', []).filter(d => d.id !== id));
  }

  _removeUpdate (id) {
    this.settings.set('updates', this.settings.get('updates', []).filter(u => u.id !== id));
  }

  async _getGitInfo () {
    const branch = await exec('git branch', this.cwd)
      .then(({ stdout }) =>
        stdout
          .toString()
          .split('\n')
          .find(l => l.startsWith('*'))
          .slice(2)
          .trim()
      );

    const revision = await exec(`git rev-parse ${branch}`, this.cwd)
      .then(r => r.stdout.toString().trim());

    const upstream = await exec('git remote get-url origin', this.cwd)
      .then(r => r.stdout.toString().match(/github\.com[:/]([\w-_]+\/[\w-_]+)/)[1]);

    return {
      upstream,
      branch,
      revision
    };
  }

  async changeBranch (branch) {
    await exec('git fetch', this.cwd);
    await exec(`git checkout ${branch}`, this.cwd);
    await exec('git pull', this.cwd);
    location.reload();
  }

  // Change Log
  async openChangeLogs () {
    const ChangeLog = await this._getChangeLogsComponent();
    openModal(() => React.createElement(ChangeLog, {
      changeLog: this.formatChangeLog(changelog)
    }));
  }

  async _getChangeLogsComponent () {
    if (!this._ChangeLog) {
      const _this = this;
      const { video } = getModule('video', 'added');
      const DiscordChangeLog = getModuleByDisplayName('ChangelogStandardTemplate');

      class ChangeLog extends DiscordChangeLog {
        constructor (props) {
          props.onScroll = () => void 0;
          props.track = () => void 0;
          super(props);

          this.oldRenderHeader = this.renderHeader;
          this.renderHeader = this.renderNewHeader.bind(this);
        }

        renderNewHeader () {
          const header = this.oldRenderHeader();
          header.props.children[0].props.children = `Vizality - ${header.props.children[0].props.children}`;
          return header;
        }

        renderVideo () {
          if (!changelog.image) {
            return null;
          }

          return React.createElement('img', {
            src: changelog.image,
            className: video,
            alt: ''
          });
        }

        renderFooter () {
          const footer = super.renderFooter();
          footer.props.children = React.createElement('span', {
            dangerouslySetInnerHTML: {
              __html: changelog.footer
            }
          });
          return footer;
        }

        componentWillUnmount () {
          _this.settings.set('last_changelog', changelog.id);
        }
      }

      this._ChangeLog = ChangeLog;
    }
    return this._ChangeLog;
  }

  formatChangeLog (json) {
    let body = '';
    const colorToClass = {
      GREEN: 'added',
      ORANGE: 'progress',
      RED: 'fixed',
      BLURPLE: 'improved'
    };
    json.contents.forEach(item => {
      if (item.type === 'HEADER') {
        body += `${item.text.toUpperCase()} {${colorToClass[item.color]}${item.noMargin ? ' marginTop' : ''}}\n======================\n\n`;
      } else {
        if (item.text) {
          body += item.text;
          body += '\n\n';
        }
        if (item.list) {
          body += ` * ${item.list.join('\n\n * ')}`;
          body += '\n\n';
        }
      }
    });
    return {
      date: json.date,
      locale: 'en-us',
      revision: 1,
      body
    };
  }
};