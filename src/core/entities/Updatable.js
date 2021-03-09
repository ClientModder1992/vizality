import { promisify } from 'util';
import { existsSync } from 'fs';
import cp from 'child_process';
import Events from 'events';
import { join } from 'path';

const exec = promisify(cp.exec);

/**
 * @todo Finish writing this.
 * Updatable class used for handling Vizality updates and addon updates.
 * @typedef VizalityUpdatable
 * @extends Events
 */
export default class Updatable extends Events {
  /**
   * @property {string} dir Directory path of item to update
   * @property {string} addonId Addon ID
   * @property {string} updateIdentifier Entity update identifier
   */
  constructor (dir, addonId, updateIdentifier) {
    super();
    this.dir = dir;
    if (!this.addonId) {
      // It might be pre-defined by plugin manager
      this.addonId = addonId;
    }
    this.path = join(this.dir, this.addonId);
    if (!updateIdentifier) {
      updateIdentifier = `${this.dir.split(/[\\/]/).pop()}_${this.addonId}`;
    }
    this.updateIdentifier = updateIdentifier;
  }

  get _cwd () {
    return { cwd: this.path };
  }

  /**
   * @returns {boolean} Whether this can be updated or not
   */
  isUpdatable () {
    return existsSync(join(this.dir, this.addonId, '.git'));
  }

  async _checkForUpdates () {
    try {
      await exec('git fetch', this._cwd);
      const gitStatus = await exec('git status -uno', this._cwd).then(({ stdout }) => stdout.toString());
      return gitStatus.includes('git pull');
    } catch (err) {
      return false;
    }
  }

  async _getUpdateCommits () {
    const branch = await this.getBranch();

    const commits = [];
    const gitLog = await exec(`git log --format="%H -- %an -- %s" ..origin/${branch}`, this._cwd)
      .then(({ stdout }) => stdout.toString());
    const lines = gitLog.split('\n');
    lines.pop();
    lines.forEach(line => {
      const data = line.split(' -- ');
      commits.push({
        id: data.shift(),
        author: data.shift(),
        message: data.shift()
      });
    });
    return commits;
  }

  async _update (force = false) {
    try {
      let command = 'git pull --ff-only';
      if (force) {
        const branch = await this.getBranch();
        command = `git reset --hard origin/${branch}`;
      }
      await exec(command, this._cwd).then(({ stdout }) => stdout.toString());
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Fetches the git repository for this entity.
   * @returns {Promise<string|null>}
   */
  async getGitRepo () {
    try {
      return await exec('git remote get-url origin', this._cwd)
        .then(r => r.stdout.toString().match(/github\.com[:/]([\w-_]+\/[\w-_]+)/)[1]);
    } catch (err) {
      console.warn('Failed to fetch git origin url; ignoring.');
      return null;
    }
  }

  /**
   * Fetches the current branch for this entity.
   * @returns {Promise<string|null>}
   */
  getBranch () {
    return exec('git branch', this._cwd)
      .then(({ stdout }) =>
        stdout.toString().split('\n').find(l => l.startsWith('*')).slice(2).trim()
      );
  }
}
