const { Plugin } = require('@entities');
const { getModule } = require('@webpack');

const { remote: { getCurrentWebContents, getCurrentWindow } } = require('electron');

const webContents = getCurrentWebContents();
const currentWindow = getCurrentWindow();

class ChannelHistory extends Plugin {
  startPlugin () {
    currentWindow.on('app-command', this.listener);
  }

  async listener (_, cmd) {
    if (cmd !== 'browser-backward' && cmd !== 'browser-forward') return;

    if (cmd === 'browser-backward' && webContents.canGoBack()) {
      getModule('history').history.back();
    } else if (cmd === 'browser-forward' && webContents.canGoForward()) {
      getModule('history').history.forward();
    }
  }

  pluginWillUnload () {
    currentWindow.off('app-command', this.listener);
  }
}

module.exports = ChannelHistory;
