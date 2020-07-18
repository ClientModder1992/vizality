const { resolveCompiler } = require('vizality/compilers');
const { dom: { createElement }, logger } = require('vizality/util');

const Updatable = require('./Updatable');

class Theme extends Updatable {
  constructor (themeID, manifest) {
    const styleManager = typeof vizality !== 'undefined' ? vizality.styleManager : global.sm;
    super(styleManager.themesDir, themeID);
    this.compiler = resolveCompiler(manifest.effectiveTheme);
    this.manifest = manifest;
    this.applied = false;
    this.MODULE = 'Theme';
    this.SUBMODULE = this.manifest.name;
    this.SUBMODULE_COLOR = this.manifest.color || null;
  }

  apply () {
    if (!this.applied) {
      this.applied = true;
      const style = createElement('style', {
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

  remove () {
    if (this.applied) {
      this.applied = false;
      this.compiler.off('src-update', this._doCompile);
      document.getElementById(`theme-${this.entityID}`).remove();
      this.compiler.disableWatcher();
    }
  }

  log (...data) {
    logger.log(this.MODULE, this.SUBMODULE, this.SUBMODULE_COLOR, ...data);
  }

  error (...data) {
    logger.error(this.MODULE, this.SUBMODULE, this.SUBMODULE_COLOR, ...data);
  }

  warn (...data) {
    logger.warn(this.MODULE, this.SUBMODULE, this.SUBMODULE_COLOR, ...data);
  }
}

module.exports = Theme;
