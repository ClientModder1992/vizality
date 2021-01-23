import { promises, existsSync } from 'fs';
import { join } from 'path';
import React from 'react';

import { Builtin } from '@vizality/entities';

import QuickCodePage from './components/QuickCode';

const { writeFile, readFile } = promises;

export default class QuickCode extends Builtin {
  async start () {
    vizality.api.settings._registerBuiltinPage({
      addonId: this.addonId,
      path: 'quick-code',
      heading: 'Quick Code',
      subheading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.',
      icon: 'Compose',
      render: props => <QuickCodePage main={this} {...props} />
    });

    this.watcher = false;

    this._customCSS = this.settings.get('customCSS');
    this._customCSSFile = null;

    await this._loadCustomCSS();

    this.injectStyles('styles/main.scss');
    this.injectStyles(this._customCSSFile, true);
  }

  stop () {
    vizality.api.routes.unregisterRoute('/dashboard/quick-code');
  }

  async _openCustomCSS () {
    vizality.api.windows.openWindow({
      windowId: 'VIZALITY_CUSTOM_CSS',
      title: 'Quick Code - CSS',
      render: <Editor {...this.props} />
    });
  }

  async _loadCustomCSS () {
    let customCSS = this.settings.get('customCSS');
    if (existsSync(this._customCSSFile)) {
      customCSS = await readFile(this._customCSSFile, 'utf8');
    } else {
      customCSS = customCSS?.trim();
      await writeFile(join(__dirname, 'stores', 'css', 'main.scss'), customCSS);
      this._customCSSFile = join(__dirname, 'stores', 'css', 'main.scss');
    }
  }
}
