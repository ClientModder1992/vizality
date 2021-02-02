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

    this._module = this.constructor.name;
    this._submodule = this.manifest.name;
  }

  log (...data) { log({ module: this._module, submodule: this._submodule }, ...data); }
  warn (...data) { warn({ module: this._module, submodule: this._submodule }, ...data); }
  error (...data) { error({ module: this._module, submodule: this._submodule }, ...data); }

  _load () {
    console.log('uh');
    if (!this.applied) {
      console.log('why');
      this.applied = true;
      const style = createElement('style', {
        id: `theme-${this.addonId}`,
        'vz-style': true,
        'vz-theme': true
      });
      document.head.appendChild(style);
      this._doCompile = debounce(async () => {
        style.innerHTML = await this.compiler.compile();
        this.log('Theme compiled successfully.');
      }, 300);

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
