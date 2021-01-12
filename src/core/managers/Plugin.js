import { Directories } from '@vizality/constants';

import AddonManager from './Addon';

export default class PluginManager extends AddonManager {
  constructor (type, dir) {
    type = 'plugins';
    dir = Directories.PLUGINS;

    super(type, dir);
  }
}
