import { join } from 'path';

import Plugin from './Plugin';

/**
 * Main class for Vizality builtins
 * @property {boolean} _ready Whether the plugin is ready or not
 * @property {SettingsCategory} settings Plugin settings
 * @property {object<string, Compiler>} styles Styles the plugin loaded
 * @abstract
 */
export default class Builtin extends Plugin {
  constructor () {
    super();
    this.baseDir = vizality.manager.builtins.dir;
    this.addonPath = join(this.baseDir, this.addonId);
    this._module = 'Builtin';
  }

  _update () {
    return void 0;
  }
}
