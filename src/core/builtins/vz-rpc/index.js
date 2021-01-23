import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';
import { Builtin } from '@vizality/entities';
import { HTTP } from '@vizality/constants';

export default class RPC extends Builtin {
  start () {
    this.handlers = getModule('commands');
    this._patchWebSocketServer();

    this._boundAddEvent = this._addEvent.bind(this);
    this._boundRemoveEvent = this._removeEvent.bind(this);

    vizality.api.rpc.registerScope('VIZALITY_PRIVATE', w => w === HTTP.WEBSITE);
    vizality.api.rpc.on('eventAdded', this._boundAddEvent);
    vizality.api.rpc.on('eventRemoved', this._boundRemoveEvent);

    vizality.api.rpc.registerEvent('IS_VIZALITY', {
      scope: 'VIZALITY_PRIVATE',
      handler: e => {
        console.log(e);
        return 'yes';
      }
    });
  }

  stop () {
    unpatch('vz-rpc-webSocket');
    unpatch('vz-rpc-webSocket-promise');

    vizality.api.rpc.unregisterEvent('IS_VIZALITY');
    vizality.api.rpc.unregisterScope('VIZALITY_PRIVATE');
    vizality.api.rpc.off('eventAdded', this._boundAddEvent);
    vizality.api.rpc.off('eventRemoved', this._boundRemoveEvent);
  }

  async _patchWebSocketServer () {
    const websocketHandler = getModule('validateSocketClient');

    patch('vz-rpc-webSocket', websocketHandler, 'validateSocketClient', args => {
      console.log(args);
      if (args[2] === 'vizality') {
        args[2] = void 0;
        args[3] = 'vizality';
      }
      return args;
    }, true);

    patch('vz-rpc-webSocket-promise', websocketHandler, 'validateSocketClient', (args, res) => {
      console.log(args);
      if (args[3] === 'vizality') {
        res.catch(() => void 0);
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
    this.handlers.events[event] = vizality.api.rpc.events[event];
  }

  _removeEvent (event) {
    delete this.handlers.events[event];
  }

  _addCommands (event) {
    this.handlers.commands[event] = vizality.api.rpc.events[event];
  }

  _removeCommands (event) {
    delete this.handlers.commands[event];
  }
}
