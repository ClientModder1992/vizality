import { Directories } from '@vizality/constants';
import { join } from 'path';

import Plugin from './Plugin';

/**
 * @todo Finish writing this.
 * Main class for Vizality builtins.
 * @extends Plugin
 * @extends Updatable
 * @extends Events
 */
export default class Builtin extends Plugin {
  constructor () {
    super();
    this.dir = Directories.BUILTINS;
    this.path = join(this.dir, this.addonId);
    this._type = 'builtin';
    this._labels = [ 'Builtin', this.constructor?.name ];
  }

  /**
   * Disables updates for builtins.
   * @returns {undefined}
   * @private
   */
  _update () {
    return void 0;
  }
}
