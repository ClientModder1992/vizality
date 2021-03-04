import { promisify } from 'util';
import cp from 'child_process';
import { promises } from 'fs';
import { join } from 'path';
import React from 'react';

import { open as openModal, close as closeModal } from '@vizality/modal';
import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import { joinClassNames } from '@vizality/util/dom';
import { Directories } from '@vizality/constants';
import { Confirm } from '@vizality/components';
import { Builtin } from '@vizality/entities';
import { Messages } from '@vizality/i18n';

import Page from './components/Page';

const Changelog = join(Directories.ROOT, 'CHANGELOG.md');
const exec = promisify(cp.exec);
const { readFile } = promises;

export default class Updater extends Builtin {
  constructor () {
    super();
    this.changelog = {
      image: 'vz-builtin://updater/assets/updates-2021-01-11.png',
      id: 'updates-2021-01-11'
    };
    this.checking = false;
    this.cwd = {
      cwd: Directories.ROOT
    };
  }

  async start () {
    this.injectStyles('styles/main.scss');

    this.settings.set('paused', false);
    this.settings.set('failed', false);
    this.settings.set('updating', false);
    this.settings.set('awaitingReload', false);

    vizality.api.actions.registerAction('OPEN_LATEST_CHANGELOG', () => this.openLatestChangelog());

    vizality.api.settings._registerBuiltinPage({
      id: 'updater',
      addonId: this.addonId,
      path: '/updater',
      heading: 'Updater',
      subheading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.',
      icon: 'CloudDownload',
      render: Page
    });

    let minutes = Number(this.settings.get('interval', 15));
    if (minutes < 1) {
      this.settings.set('interval', 1);
      minutes = 1;
    }

    this._interval = setInterval(this.checkForUpdates.bind(this), minutes * 60 * 1000);
    this.checkForUpdates();

    const lastChangelog = this.settings.get('lastChangelog', '');

    if (this.changelog.id !== lastChangelog) {
      this.openLatestChangelog();
    }
  }

  stop () {
    vizality.api.routes.unregisterRoute('updater');
    vizality.api.actions.unregisterAction('OPEN_LATEST_CHANGELOG');
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
    this.settings.set('checkingProgress', [ 0, 0 ]);
    const disabled = this.settings.get('addonsDisabled', []).map(e => e.id);
    const skipped = this.settings.get('addonsSkipped', []);
    const plugins = [ ...vizality.manager.plugins.values ];
    const themes = [ ...vizality.manager.themes.values ];

    const addons = plugins.concat(themes).filter(e => !disabled.includes(e.updateIdentifier) && e.isUpdatable());
    if (!disabled.includes(vizality.updateIdentifier)) {
      addons.push(vizality);
    }

    let done = 0;
    const updates = [];
    const addonsLength = addons.length;
    const parallel = allConcurrent ? addonsLength : this.settings.get('concurrency', 2);
    await Promise.all(Array(parallel).fill(null).map(async () => {
      let addon;
      while ((addon = addons.shift())) {
        const repo = await addon.getGitRepo();
        if (repo) {
          const shouldUpdate = await addon._checkForUpdates();
          if (shouldUpdate) {
            const commits = await addon._getUpdateCommits();
            if (commits[0] && skipped[addon.updateIdentifier] === commits[0].id) {
              return;
            }
            updates.push({
              manifest: addon.manifest,
              addonId: addon.addonId,
              id: addon.updateIdentifier,
              commits,
              repo
            });
          }
        }
        done++;
        this.settings.set('checkingProgress', [ done, addonsLength ]);
      }
    }));

    this.settings.set('updates', updates);
    this.settings.set('lastCheck', Date.now());
    this.settings.set('checking', false);
    if (updates.length > 0) {
      if (this.settings.get('automatic', false)) {
        this.doUpdate();
      } else if (!document.querySelector(`#vz-updater-update-available, [vz-route='updater']`)) {
        vizality.api.notices.sendToast('vz-updater-update-available', {
          header: Messages.VIZALITY_UPDATES_TOAST_AVAILABLE_HEADER,
          content: Messages.VIZALITY_UPDATES_TOAST_AVAILABLE_DESC,
          icon: 'CloudDownload',
          buttons: [ {
            text: Messages.VIZALITY_UPDATES_OPEN_UPDATER,
            color: 'grey',
            onClick: () => {
              vizality.api.notices.closeToast('vz-updater-update-available');
              vizality.api.routes.navigateTo('updater');
            }
          }, {
            text: Messages.VIZALITY_UPDATES_UPDATE,
            color: 'green',
            onClick: () => {
              vizality.api.notices.closeToast('vz-updater-update-available');
              this.doUpdate();
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
        entity = vizality.manager.plugins.get(update.id.replace('plugins_', ''));
      } else if (update.id.startsWith('theme')) {
        entity = vizality.manager.themes.get(update.id.replace('themes_', ''));
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
      if (!document.querySelector(`#vizality-updater, [vz-builtin='updater']`)) {
        vizality.api.notices.sendToast('vz-updater-update-failed', {
          header: Messages.VIZALITY_UPDATES_TOAST_FAILED,
          icon: 'CloseCircle',
          buttons: [ {
            text: Messages.VIZALITY_UPDATES_FORCE,
            color: 'red',
            look: 'outlined',
            onClick: () => this.confirmForce()
          }, {
            text: Messages.FRIEND_REQUEST_IGNORE,
            look: 'outlined',
            color: 'grey'
          }, {
            text: Messages.VIZALITY_UPDATES_OPEN_UPDATER,
            color: 'blue',
            look: 'ghost',
            onClick: () => {
              vizality.api.notices.closeToast('vz-updater-update-failed');
              vizality.api.routes.navigateTo('updater');
            }
          } ]
        });
      }
    }
  }

  // MODALS
  confirmForce (callback) {
    const { colorStandard } = getModule('colorStandard');

    openModal(() =>
      <Confirm
        red={true}
        header={Messages.SUPPRESS_EMBED_TITLE}
        confirmText={Messages.VIZALITY_UPDATES_FORCE}
        cancelText={Messages.CANCEL}
        onConfirm={() => {
          if (callback) {
            // eslint-disable-next-line callback-return
            callback();
          }
          this.doUpdate(true);
        }}
        onCancel={closeModal}
      >
        <div className={colorStandard}>
          {Messages.VIZALITY_UPDATES_FORCE_MODAL}
        </div>
      </Confirm>
    );
  }

  // UTILS
  skipUpdate (id, commit) {
    this.settings.set('addonsSkipped', {
      ...this.settings.get('addonsSkipped', {}),
      [id]: commit
    });
    this._removeUpdate(id);
  }

  disableUpdates (addon) {
    this.settings.set('addonsDisabled', [
      ...this.settings.get('addonsDisabled', []),
      {
        id: addon.id,
        name: addon.name,
        icon: addon.icon
      }
    ]);
    this._removeUpdate(addon.id);
  }

  enableUpdates (id) {
    this.settings.set('addonsDisabled', this.settings.get('addonsDisabled', []).filter(d => d.id !== id));
  }

  _removeUpdate (id) {
    this.settings.set('updates', this.settings.get('updates', []).filter(u => u.id !== id));
  }

  async getGitInfo () {
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
  async openLatestChangelog () {
    const { openModal: openNewModal } = getModule('openModal', 'closeModal');
    const changelogObject = await this.formatChangelog();
    const ChangeLog = await this._getChangeLogsComponent();
    openNewModal(props => <ChangeLog changeLog={changelogObject} {...props} />);
  }

  async _getChangeLogsComponent () {
    if (!this._ChangeLog) {
      const _this = this;
      const { video, image } = getModule('video', 'image', 'added');
      const DiscordChangeLog = getModuleByDisplayName('ChangelogStandardTemplate');

      class ChangeLog extends DiscordChangeLog {
        constructor (props) {
          super(props);

          this.close = this.close.bind(this);
          this.onClose = props.onClose;
          this.onCloseRequest = props.onClose;
          this.handleScroll = () => void 0;
          this.track = () => void 0;
          this.oldRenderHeader = this.renderHeader;
          this.renderHeader = this.renderNewHeader.bind(this);
        }

        renderNewHeader () {
          const header = this.oldRenderHeader();
          header.props.children[0].props.children = `Vizality - ${header.props.children[0].props.children}`;
          return header;
        }

        renderVideo () {
          if (!_this.changelog.image) {
            return null;
          }

          return <img src={_this.changelog.image} className={joinClassNames(image, video)} />;
        }

        renderFooter () {
          const { anchor, anchorUnderlineOnHover } = getModule('anchorUnderlineOnHover');
          const { colorStandard } = getModule('colorStandard');
          const footer = super.renderFooter();
          footer.props.children =
            <div className={joinClassNames('vz-changelog-modal-footer', colorStandard)}>
              Missed an update?
              <a
                className={joinClassNames('vz-changelog-modal-footer-a', anchor, anchorUnderlineOnHover)}
                onClick={() => vizality.api.routes.navigateTo('changelog')}
              > Check out our full changelog history.</a>
            </div>;

          return footer;
        }

        close () {
          this.onClose();
        }
      }

      this._ChangeLog = ChangeLog;
    }
    return this._ChangeLog;
  }

  async formatChangelog () {
    const log = await readFile(Changelog, 'utf-8');

    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/g;
    const date = log.match(dateRegex)[0];
    const previousDate = log.match(dateRegex)[1];

    const body = log.slice(log.search(date) + 11, log.search(previousDate) - 13).trim();

    this.settings.set('lastChangelog', this.changelog.id);

    return {
      id: this.changelog.id,
      date,
      locale: 'en-us',
      revision: 1,
      body
    };
  }
}
