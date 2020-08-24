const API = require('./API');
const Collection = require('./Collection');
const Plugin = require('./Plugin');
const Theme = require('./Theme');
const Updatable = require('./Updatable');

module.exports = class Entities {
  static get API () { return API; }
  static get Collection () { return Collection; }
  static get Updatable () { return Updatable; }
  static get Plugin () { return Plugin; }
  static get Theme () { return Theme; }
};
