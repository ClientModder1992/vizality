const { logger: { log, warn, error } } = require('@utilities');
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
const current = {
  /**
   * Gets the current user.
   * @returns {User} User object
   */
  '': 'lol',

  get: () => {
    try {
      return getModule('getCurrentUser').getCurrentUser();
    } catch (err) {
      return error(_module, `${_submodule}:get`, null, err);
    }
  },

  isSpotifyPremium: () => {
    vizality.modules.webpack.getModule('isSpotifyPremium').isSpotifyPremium()
  },
  
  /**
   * Gets the current user ID.
   * @returns {snowflake} User ID
   */
  getId: () => {
    try {
      return getModule('getId').getId();
    } catch (err) {
      return error(_module, `${_submodule}:getId`, null, err);
    }
  },

  getToken: () => {

  },
};

module.exports = current;
