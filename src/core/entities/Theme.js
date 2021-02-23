import { log, warn, error } from '@vizality/util/logger';
import { resolveCompiler } from '@vizality/compilers';
import { createElement } from '@vizality/util/dom';
import { Directories } from '@vizality/constants';
import { debounce } from 'lodash';

import Updatable from './Updatable';

export default class Theme extends Updatable {
  constructor (addonId, manifest) {
    super(Directories.THEMES, addonId);
    this.compiler = resolveCompiler(manifest.effectiveTheme);
    this.manifest = manifest;
    this.applied = false;
    this._type = 'theme';
    this._labels = [ this._type, this.manifest?.name ];
  }

  log (...message) { log({ labels: this._labels, message }); }
  warn (...message) { warn({ labels: this._labels, message }); }
  error (...message) { error({ labels: this._labels, message }); }

  _load () {
    if (!this.applied) {
      this.applied = true;
      const style = createElement('style', {
        id: `theme-${this.addonId}`,
        'vz-style': true,
        'vz-theme': true
      });

      document.head.appendChild(style);
      this._doCompile = debounce(async (showLogs = true) => {
        style.innerHTML = await this.compiler.compile();
        if (showLogs) this.log('Theme compiled successfully.');
      }, 300);
      this.compiler.enableWatcher();
      this.compiler.on('src-update', this._doCompile);
      this.log('Theme loaded.');
      return this._doCompile(false);
    }
  }

  _unload () {
    if (this.applied) {
      this.applied = false;
      this.compiler.off('src-update', this._doCompile);
      document.getElementById(`theme-${this.addonId}`).remove();
      this.compiler.disableWatcher();
      this.log('Theme unloaded.');
    }
  }
}
