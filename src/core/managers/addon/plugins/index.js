const { ROOT_FOLDER } = require('@constants');

const { readdirSync } = require('fs');
const { resolve } = require('path');

const AddonManager = require('../../addon');

class Plugins extends AddonManager {
  constructor (type, dir) {
    super(type, dir);
  }
};

module.exports = Plugins;