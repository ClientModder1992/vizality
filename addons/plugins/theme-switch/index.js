const { misc: { sleep } } = require('@util');
const { getModule } = require('@webpack');
const { Plugin } = require('@entities');

module.exports = class ThemeSwitch extends Plugin {
  async onStart () {
    await sleep(1500);
    getModule('updateLocalSettings').updateLocalSettings({ theme: 'light' });
  }
};
