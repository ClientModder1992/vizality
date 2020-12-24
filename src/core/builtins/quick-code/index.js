import { promises, existsSync } from 'fs';
import { join } from 'path';
import React from 'react';

import { getModule } from '@vizality/webpack';
import { Builtin } from '@vizality/core';

import QuickCodePage from './components/QuickCode';

const { writeFile, readFile } = promises;

export default class QuickCode extends Builtin {
  async onStart () {
    await vizality.api.settings.registerDashboardItem({
      id: this.addonId,
      path: 'quick-code',
      heading: 'Quick Code',
      subheading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.',
      icon: 'Compose',
      render: props => <QuickCodePage main={this} {...props} />
    });

    this.watcher = false;

    this._customCSS = this.settings.get('custom-css');
    this._customCSSFile = join(__dirname, 'stores', 'css', 'main.scss');

    await this._loadCustomCSS();

    this.injectStyles('styles/main.scss');
    this.injectStyles(this._customCSSFile, true);
  }

  async _openCustomCSS () {
    const popoutModule = getModule('setAlwaysOnTop', 'open');
    const id = 'DISCORD_VIZALITY_CUSTOM_CSS';

    vizality.api.popups.openWindow({
      id,
      title: 'Quick Code - CSS',
      render: <Editor {...this.props} />
    });

    popoutModule.setAlwaysOnTop('DISCORD_VIZALITY_CUSTOM_CSS', false);
  }

  async _loadCustomCSS () {
    let customCSS = this.settings.get('custom-css');
    if (existsSync(this._customCSSFile)) {
      customCSS = await readFile(this._customCSSFile, 'utf8');
    } else {
      customCSS = customCSS.trim();
      await writeFile(this._customCSSFile, customCSS);
    }
  }
}
