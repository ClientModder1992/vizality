const { Plugin } = require('@entities');

const modules = require('./modules');

class CoreDiscordEnhancements extends Plugin {
  startPlugin () {
    this.loadStylesheet('scss/style.scss');

    this.callbacks = [];

    Object.values(modules).forEach(async mod => {
      const callback = await mod();
      if (typeof callback === 'function') {
        this.callbacks.push(callback);
      }
    });
  }

  pluginWillUnload () {
    this.callbacks.forEach(cb => cb());
  }
}

module.exports = CoreDiscordEnhancements;
