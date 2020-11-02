const PluginManager = require('./pluginManager');

class Bundled extends PluginManager {
  constructor (dir) {
    super(dir);
  }
};

module.exports = Bundled;
