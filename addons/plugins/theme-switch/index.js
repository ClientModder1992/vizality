const { Plugin } = require('@entities');
const { getModule } = require('@webpack');
const { sleep } = require('@util');

module.exports = class ThemeSwitch extends Plugin {
  async startPlugin () {
    await sleep(1500);
    getModule('updateLocalSettings').updateLocalSettings({ theme: 'light' });
  }
};
