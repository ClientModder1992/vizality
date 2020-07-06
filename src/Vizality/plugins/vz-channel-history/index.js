const { Plugin } = require('vizality/entities');
const { getModule } = require('vizality/webpack');

const electron = require('electron').remote;
const webContents = electron.getCurrentWebContents();
const currentWindow = electron.getCurrentWindow();

module.exports = class ChannelHistory extends Plugin {
  startPlugin () {
    currentWindow.on('app-command', this.listener);
  }

  async listener (ev, cmd) {
    if (cmd !== 'browser-backward' && cmd !== 'browser-forward') return;

    if (cmd === 'browser-backward' && webContents.canGoBack()) {
      (await getModule([ 'history' ], true)).history.back();
    } else if (cmd === 'browser-forward' && webContents.canGoForward()) {
      (await getModule([ 'history' ], true)).history.forward();
    }
  }

  pluginWillUnload () {
    currentWindow.off('app-command', this.listener);
  }
};
