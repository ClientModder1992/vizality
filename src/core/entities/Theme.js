const { dom: { createElement }, logger: { error, log, warn } } = require('@vizality/util');
const { resolveCompiler } = require('@vizality/compilers');

const Updatable = require('./Updatable');

module.exports = class Theme extends Updatable {
  constructor (themeID, manifest) {
    const themeManager = typeof vizality !== 'undefined' ? vizality.manager.themes : global.sm;
    super(themeManager._dir, themeID);
    this.compiler = resolveCompiler(manifest.effectiveTheme);
    this.manifest = manifest;
    this.applied = false;

    this.module = 'Theme';
    this.submodule = this.manifest.name;
    this.submoduleColor = null;
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
      return this._doCompile();
    }
    this.log('Theme loaded.');
  }

  _unload () {
    if (this.applied) {
      this.applied = false;
      this.compiler.off('src-update', this._doCompile);
      document.getElementById(`theme-${this.addonId}`).remove();
      this.compiler.disableWatcher();
    }
  }

  log (...data) {
    log(this.module, this.submodule, null, ...data);
  }

  error (...data) {
    error(this.module, this.submodule, null, ...data);
  }

  warn (...data) {
    warn(this.module, this.submodule, null, ...data);
  }
};
