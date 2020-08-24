const { logger: { log, warn, error } } = require('@util');
const { getModule } = require('@webpack');

const _module = 'Module';
const _submodule = `Discord:User:Current`;

/**
 * Current user module.
 * Contains functions/data relating to the current user.
 * @namespace discord.user.current
 * @module discord.user.current
 * @memberof discord.user
 */
class Current {
  static getCurrentUser () {
    try {
      return getModule('getCurrentUser').getCurrentUser();
    } catch (err) {
      return error(_module, `${_submodule}:get`, null, err);
    }
  }

  static isSpotifyPremium () {
    vizality.modules.webpack.getModule('isSpotifyPremium').isSpotifyPremium()
  }

  /**
   * Gets the current user ID.
   * @returns {snowflake} User ID
   */
  static getId () {
    try {
      return getModule('getId').getId();
    } catch (err) {
      return error(_module, `${_submodule}:getId`, null, err);
    }
  }

  static getToken () {
    return void 0;
  }
};

module.exports = Current;
