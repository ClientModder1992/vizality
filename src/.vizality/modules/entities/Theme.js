const Compilers = require('@compilers');
const Updatable = require('@updatable');
const Util = require('@util');

module.exports = class Theme extends Updatable {
  constructor (themeID, manifest) {
    const styleManager = typeof vizality !== 'undefined' ? vizality.styleManager : global.sm;
    super(styleManager.themesDir, themeID);
    this.compiler = Compilers.resolveCompiler(manifest.effectiveTheme);
    this.manifest = manifest;
    this.applied = false;

    this.module = 'Theme';
    this.submodule = this.manifest.name;
    this.submoduleColor = this.manifest.color || null;
  }

  _load () {
    if (!this.applied) {
      this.applied = true;
      const style = Util.DOM.createElement('style', {
        id: `theme-${this.entityID}`,
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
      document.getElementById(`theme-${this.entityID}`).remove();
      this.compiler.disableWatcher();
    }
  }

  log (...data) {
    Util.Logger.log(this.module, this.submodule, this.submoduleColor, ...data);
  }

  error (...data) {
    Util.Logger.error(this.module, this.submodule, this.submoduleColor, ...data);
  }

  warn (...data) {
    Util.Logger.warn(this.module, this.submodule, this.submoduleColor, ...data);
  }
};
