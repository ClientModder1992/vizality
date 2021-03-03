import { join } from 'path';

import { Directories } from '@vizality/constants';

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
    this.dir = Directories.BUILTINS;
    this.path = join(this.dir, this.addonId);
    this._type = 'builtin';
    this._labels = [ 'Builtin', this.constructor?.name ];
  }

  _update () {
    return void 0;
  }
}
