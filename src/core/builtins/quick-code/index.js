const { promises: { writeFile, readFile }, existsSync } = require('fs');
const { join } = require('path');

const { Builtin } = require('@vizality/entities');

const CodeView = require('./components/CodeView');

module.exports = class QuickCode extends Builtin {
  async onStart () {
    vizality.api.settings.registerDashboardItem({
      id: this.entityID,
      path: 'quick-code',
      heading: 'Quick Code',
      subheading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.',
      icon: 'Compose',
      render: CodeView
    });

    this.watcher = false;

    this._customCSS = vizality.manager.builtins.get(this.entityID).settings.get('custom-css');
    this._customCSSFile = join(__dirname, 'stores', 'css', 'main.scss');

    await this._loadCustomCSS();

    this.injectStyles('styles/main.scss');
    this.injectStyles(this._customCSSFile, true);
  }

  async _loadCustomCSS () {
    let customCSS = vizality.manager.builtins.get(this.entityID).settings.get('custom-css');
    if (existsSync(this._customCSSFile)) {
      customCSS = await readFile(this._customCSSFile, 'utf8');
    } else {
      customCSS = customCSS.trim();
      await writeFile(this._customCSSFile, customCSS);
    }
  }
};
