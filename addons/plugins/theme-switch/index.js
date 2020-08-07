const { getModule } = require('@webpack');
const { Plugin } = require('@entities');
const { sleep } = require('@utilities');

class ThemeSwitch extends Plugin {
  async onStart () {
    await sleep(1500);
    getModule('updateLocalSettings').updateLocalSettings({ theme: 'light' });
  }
}

module.exports = ThemeSwitch;
