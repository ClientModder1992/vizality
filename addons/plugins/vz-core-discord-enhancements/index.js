const { Plugin } = require('@entities');

const modules = require('./modules');

module.exports = class CoreDiscordEnhancements extends Plugin {
  onStart () {
    this.injectStyles('styles/main.scss');
    this.callbacks = [];

    Object.values(modules).forEach(async mod => {
      const callback = await mod();
      if (typeof callback === 'function') {
        this.callbacks.push(callback);
      }
    });
  }

  onStop () {
    this.callbacks.forEach(cb => cb());
  }
};
