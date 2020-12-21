const { readdirSync } = require('fs');
const { resolve } = require('path');

const { Directories } = require('@vizality/constants');

const AddonManager = require('../../addon');

module.exports = class BuiltinManager extends AddonManager {
  constructor (type, dir) {
    type = 'builtins';
    dir = Directories.BUILTINS;

    super(type, dir);
  }

  _setIcon () {
    return void 0;
  }
};
