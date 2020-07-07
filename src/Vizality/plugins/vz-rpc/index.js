const { Plugin } = require('vizality/entities');
const { getModule } = require('vizality/webpack');
const { WEBSITE } = require('vizality/constants');
const { inject, uninject } = require('vizality/injector');

module.exports = class RPC extends Plugin {
  async startPlugin () {
    this.handlers = getModule('INVITE_BROWSER');
    this._patchHTTPServer();
    this._patchWebSocketServer();

    this._boundAddEvent = this._addEvent.bind(this);
    this._boundRemoveEvent = this._removeEvent.bind(this);

    vizality.api.rpc.registerScope('VIZALITY_PRIVATE', w => w === WEBSITE);
    vizality.api.rpc.on('eventAdded', this._boundAddEvent);
    vizality.api.rpc.on('eventRemoved', this._boundRemoveEvent);
  }

  pluginWillUnload () {
    uninject('vz-rpc-ws');
    uninject('vz-rpc-ws-promise');

    vizality.rpcServer.removeAllListeners('request');
    vizality.rpcServer.on('request', this._originalHandler);

    vizality.api.rpc.unregisterScope('VIZALITY_PRIVATE');
    vizality.api.rpc.off('eventAdded', this._boundAddEvent);
    vizality.api.rpc.off('eventRemoved', this._boundRemoveEvent);
  }

  _patchHTTPServer () {
    [ this._originalHandler ] = vizality.rpcServer.listeners('request');
    vizality.rpcServer.removeAllListeners('request');
    vizality.rpcServer.on('request', (req, res) => {
      if (req.url === '/vizality') {
        const data = JSON.stringify({
          code: 69,
          vizality: vizality.gitInfos,
          plugins: [ ...vizality.pluginManager.plugins.values() ].filter(p => !p.isInternal).map(p => p.entityID),
          themes: [ ...vizality.styleManager.themes.values() ].filter(t => t.isTheme).map(t => t.entityID)
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Content-Length', data.length);
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      } else {
        this._originalHandler(req, res);
      }
    });
  }

  async _patchWebSocketServer () {
    const websocketHandler = getModule('validateSocketClient');

    inject('vz-rpc-ws', websocketHandler, 'validateSocketClient', args => {
      if (args[2] === 'vizality') {
        args[2] = void 0;
        args[3] = 'vizality';
      }
      return args;
    }, true);

    inject('vz-rpc-ws-promise', websocketHandler, 'validateSocketClient', (args, res) => {
      if (args[3] === 'vizality') {
        res.catch(() => void 0); // Shut
        args[0].authorization.scopes = [
          'VIZALITY',
          ...Object.keys(vizality.api.rpc.scopes).filter(s => vizality.api.rpc.scopes[s](args[1]))
        ];
        return Promise.resolve(null);
      }
      return res;
    });
  }

  _addEvent (event) {
    this.handlers[event] = vizality.rpc.api.events[event];
  }

  _removeEvent (event) {
    delete this.handlers[event];
  }
};
