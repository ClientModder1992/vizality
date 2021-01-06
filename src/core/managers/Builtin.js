import { Directories } from '@vizality/constants';

import AddonManager from './Addon';

export default class BuiltinManager extends AddonManager {
  constructor (type, dir) {
    type = 'builtins';
    dir = Directories.BUILTINS;

    super(type, dir);
  }

  _setIcon () {
    return void 0;
  }
}
