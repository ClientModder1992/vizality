const { promises: { writeFile, readFile }, existsSync } = require('fs');
const { join } = require('path');

const { getModule } = require('@vizality/webpack');
const { Builtin } = require('@vizality/entities');
const { React } = require('@vizality/react');

const CustomCSS = require('./components/CustomCSS');

module.exports = class Snippets extends Builtin {
  async onStart () {
    vizality.api.settings.registerDashboardItem({
      id: this.entityID,
      path: 'snippets',
      heading: 'Snippets',
      subheading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.',
      icon: 'Scissors',
      render: CustomCSS
    });

    this._customCSS = '';
    this._customCSSFile = join(__dirname, 'custom', 'css', 'editor.scss');
    await this._loadCustomCSS();

    this.injectStyles('styles/main.scss');
  }

  onStop () {

  }

  async _loadCustomCSS () {
    if (existsSync(this._customCSSFile)) {
      this._customCSS = await readFile(this._customCSSFile, 'utf8');
    }

    this._saveCustomCSS(this._customCSS);
  }

  async _saveCustomCSS (css) {
    this._customCSS = css.trim();
    await writeFile(this._customCSSFile, this._customCSS);
  }
};
