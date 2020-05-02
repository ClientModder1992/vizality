const { API } = require('powercord/entities');

module.exports = class RPCAPI extends API {
  constructor () {
    super();

    this.scopes = {};
    this.events = {};
  }

  registerScope (scope, grant) {
    this.scopes[scope] = grant;
    this.emit('scopeAdded', scope);
  }

  registerEvent (name, properties) {
    this.events[name] = properties;
    this.emit('eventAdded', name);
  }

  unregisterScope (scope) {
    delete this.scopes[scope];
    this.emit('scopeRemoved', scope);
  }

  unregisterEvent (name) {
    delete this.events[name];
    this.emit('eventRemoved', name);
  }
};
