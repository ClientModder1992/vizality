import { error, log, warn } from '@vizality/util/logger';
import { resolveCompiler } from '@vizality/compilers';
import { createElement } from '@vizality/util/dom';

import Updatable from './Updatable';

export default class Theme extends Updatable {
  constructor (themeID, manifest) {
    const themeManager = typeof vizality !== 'undefined' ? vizality.manager.themes : window.sm;
    super(themeManager.dir, themeID);
    this.compiler = resolveCompiler(manifest.effectiveTheme);
    this.manifest = manifest;
    this.applied = false;

    this._module = this.constructor.name;
    this._submodule = this.manifest.name;
  }

  log (...data) {
    log(this._module, this._submodule, null, ...data);
  }

  error (...data) {
    error(this._module, this._submodule, null, ...data);
  }

  warn (...data) {
    warn(this._module, this._submodule, null, ...data);
  }

  _load () {
    if (!this.applied) {
      this.applied = true;
      const style = createElement('style', {
        id: `theme-${this.addonId}`,
        'vz-style': true,
        'vz-theme': true
      });
      document.head.appendChild(style);
      this._doCompile = async () => {
        style.innerHTML = await this.compiler.compile();
        this.log('Theme compiled successfully.');
      };

      this.compiler.enableWatcher();
      this.compiler.on('src-update', this._doCompile);
      this.log('Theme loaded.');
      return this._doCompile();
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
