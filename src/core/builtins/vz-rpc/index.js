import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';
import { Builtin } from '@vizality/entities';
import { HTTP } from '@vizality/constants';

export default class RPC extends Builtin {
  start () {
    this.handlers = getModule('events', 'commands');
    this._patchWebSocketServer();

    this._boundAddEvent = this._addEvent.bind(this);
    this._boundAddCommand = this._addCommand.bind(this);
    this._boundRemoveEvent = this._removeEvent.bind(this);
    this._boundRemoveCommand = this._removeCommand.bind(this);

    vizality.api.rpc.registerScope('VIZALITY_PRIVATE', w => w === HTTP.WEBSITE);

    vizality.api.rpc.on('eventAdd', this._boundAddEvent);
    vizality.api.rpc.on('commandAdd', this._boundAddCommand);
    vizality.api.rpc.on('eventRemove', this._boundRemoveEvent);
    vizality.api.rpc.on('commandRemove', this._boundRemoveCommand);

    vizality.api.rpc.registerCommand({
      id: 'IS_VIZALITY',
      scope: 'VIZALITY_PRIVATE',
      handler: () => {
        return 'true';
      }
    });

    vizality.api.rpc.registerCommand({
      id: 'VIZALITY_GET_INFO',
      scope: 'VIZALITY_PRIVATE',
      handler: () => {
        return {
          git: vizality.git,
          plugins: vizality.manager.plugins.keys.map(k => ({
            manifest: vizality.manager.plugins.get(k).manifest,
            addonId: k,
            enabled: vizality.manager.plugins.isEnabled(k)
          })),
          themes: vizality.manager.themes.keys.map(k => ({
            manifest: vizality.manager.themes.get(k).manifest,
            addonId: k,
            enabled: vizality.manager.themes.isEnabled(k)
          })),
          builtins: vizality.manager.builtins.keys.map(k => ({
            addonId: k,
            enabled: vizality.manager.builtins.isEnabled(k)
          }))
        };
      }
    });

    vizality.api.rpc.registerCommand({
      id: 'VIZALITY_NAVIGATE',
      scope: 'VIZALITY_PRIVATE',
      handler: evt => {
        return vizality.api.routes.navigateTo(evt.args);
      }
    });
  }

  stop () {
    unpatch('vz-rpc-webSocket');
    unpatch('vz-rpc-webSocket-promise');

    vizality.api.rpc.unregisterCommand('IS_VIZALITY');
    vizality.api.rpc.unregisterCommand('VIZALITY_GET_INFO');
    vizality.api.rpc.unregisterCommand('VIZALITY_NAVIGATE');
    vizality.api.rpc.unregisterScope('VIZALITY_PRIVATE');

    vizality.api.rpc.off('eventAdd', this._boundAddEvent);
    vizality.api.rpc.off('commandAdd', this._boundAddCommand);
    vizality.api.rpc.off('eventRemove', this._boundRemoveEvent);
    vizality.api.rpc.off('commandRemove', this._boundRemoveCommand);
  }

  async _patchWebSocketServer () {
    const websocketHandler = getModule('validateSocketClient');
    patch('vz-rpc-webSocket', websocketHandler, 'validateSocketClient', args => {
      if (args[2] === 'vizality') {
        args[2] = void 0;
        args[3] = 'vizality';
      }
      return args;
    }, true);

    patch('vz-rpc-webSocket-promise', websocketHandler, 'validateSocketClient', (args, res) => {
      if (args[3] === 'vizality') {
        res.catch(() => void 0);
        args[0].authorization.scopes = [
          'VIZALITY',
          ...Object.keys(vizality.api.rpc.scopes).filter(s => vizality.api.rpc.scopes[s].grant(args[1]))
        ];
        return Promise.resolve(null);
      }
      return res;
    });
  }

  _addEvent (event) {
    this.handlers.events[event] = vizality.api.rpc.events[event];
  }

  _addCommand (command) {
    this.handlers.commands[command] = vizality.api.rpc.commands[command];
  }

  _removeEvent (event) {
    delete this.handlers.events[event];
  }

  _removeCommand (command) {
    delete this.handlers.commands[command];
  }
}
