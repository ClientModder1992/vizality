import { Directories } from '@vizality/constants';

import AddonManager from './Addon';

export default class PluginManager extends AddonManager {
  constructor (type, dir) {
    type = 'plugins';
    dir = Directories.PLUGINS;

    super(type, dir);
  }

  // load (sync = false) {
  //   const missing = {};
  //   missing[this.type] = [];

  //   const isOverlay = (/overlay/).test(location.pathname);
  //   readdirSync(this.dir).forEach(filename =>/*!this.isInstalled(filename) &&*/ this.mount(filename));
  //   for (const plugin of [ ...this[this.type].values() ]) {
  //     if (vizality.settings.get('disabledPlugins', []).includes(plugin.addonId)) {
  //       continue;
  //     }
  //     if (
  //       (plugin.manifest.appMode === 'overlay' && isOverlay) ||
  //       (plugin.manifest.appMode === 'app' && !isOverlay) ||
  //       plugin.manifest.appMode === 'both'
  //     ) {
  //       if (sync && !this.get(plugin.addonId)._ready) {
  //         this.enable(plugin.addonId);
  //         missing[this.type].push(plugin.addonId);
  //       } else if (!sync) {
  //         this.enable(plugin.addonId);
  //       }
  //     } else {
  //       this[this.type].delete(plugin);
  //     }
  //   }

  //   if (sync) {
  //     return missing[this.type];
  //   }
  // }
}
