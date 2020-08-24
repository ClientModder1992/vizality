const Array = require('./Array');
const Color = require('./Color');
const DOM = require('./DOM');
const File = require('./File');
const Filter = require('./Filter');
const Logger = require('./Logger');
const Misc = require('./Misc');
const Number = require('./Number');
const Object = require('./Object');
const React = require('./React');
const String = require('./String');
const Time = require('./Time');
const Type = require('./Type');

module.exports = class Util {
  static get Array () { return Array; }
  static get Color () { return Color; }
  static get DOM () { return DOM; }
  static get File () { return File; }
  static get Filter () { return Filter; }
  static get Logger () { return Logger; }
  static get Misc () { return Misc; }
  static get Number () { return Number; }
  static get Object () { return Object; }
  static get React () { return React; }
  static get String () { return String; }
  static get Time () { return Time; }
  static get Type () { return Type; }
};
