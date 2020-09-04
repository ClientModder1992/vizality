const { string: { isUrl }, logger: { error } } = require('@util');
const { getModule } = require('@webpack');
// eslint-disable-next-line no-unused-vars
const __typings__ = require('@typings');

const Constants = require('../module/constants');

const relationship = require('./relationship');
const snowflake = require('../snowflake');
const activity = require('./activity');
const current = require('./current');
const status = require('./status');
const action = require('./action');

const _module = 'Module';
const _submodule = 'Discord:User';

/**
 * User module.
 * Contains functions/data relating to users.
 * Users in Discord are generally considered the base entity. Users can spawn across the
 * entire platform, be members of guilds, participate in text and voice chat, and * much
 * more. Users are separated by a distinction of "bot" vs "normal." Although they are
 * similar, bot users are automated users that are "owned" by another user. Unlike normal
 * users, bot users do not have a limitation on the number of Guilds they can be a part of.
 * Reference: @see {@link https://discord.com/developers/docs/resources/user|Discord}
 * @namespace discord.user
 * @module discord.user
 * @memberof discord
 */
const user = {
  action,
  activity,
  // No, there is no meaning in chaining the next 3 items ( ͡° ͜ʖ ͡°)
  current,
  relationship,
  status,

  /**
   * Gets the user object.
   * @param {snowflake} userId User ID
   * @returns {User|undefined} User object
   */
  getUser: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return getModule('getUser', 'getUsers').getUser(userId);
    } catch (err) {
      return error(_module, `${_submodule}:getUser`, null, err);
    }
  },

  /**
   * Gets the user object from their user tag.
   * @param {snowflake} userTag User tag
   * @returns {User|undefined} User object
   */
  getUserByTag: (userTag) => {
    try {
      // Check if the user tag is a string
      if (typeof userTag !== 'string') {
        // Check if the user tag is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userTag === null ? 'null' : typeof userTag})`);
      }

      const username = userTag.slice(0, -5);
      const discriminator = userTag.slice(-4);

      return getModule('getUser', 'getUsers').findByTag(username, discriminator);
    } catch (err) {
      return error(_module, `${_submodule}:getUserByTag`, null, err);
    }
  },

  /**
   * Gets all of the currently cached user objects.
   * @returns {Collection<snowflake, User>} All cached user objects
   */
  getUsers: () => {
    try {
      return getModule('getUser', 'getUsers').getUsers();
    } catch (err) {
      return error(_module, `${_submodule}:getUsers`, null, err);
    }
  },

  /**
   * Gets all of the currently cached user IDs.
   * @returns {Array<snowflake>|undefined} All cached user IDs
   */
  getUserIds: () => {
    try {
      return getModule('getStatus', 'getUserIds').getUserIds();
    } catch (err) {
      return error(_module, `${_submodule}:getUserIds`, null, err);
    }
  },

  /**
   * Gets the user's avatar hash. @see {@link https://discord.com/developers/docs/reference#image-formatting-image-base-url|Discord}
   * If no user ID is specified, tries to get the avatar string of the current user.
   * @param {snowflake} userId User ID
   * @returns {string|undefined} User avatar string
   */
  getAvatar: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return user.getUser(userId).avatar;
    } catch (err) {
      return error(_module, `${_submodule}:getAvatar`, null, err);
    }
  },

  /**
   * Gets the user avatar URL.
   * @param {snowflake} [userId] User ID
   * @returns {string|undefined} User avatar URL
   */
  getAvatarUrl: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      const AvatarURL = user.getUser(userId).avatarURL;

      // Check if the avatar URL exists, is not a valid URL, and starts with /
      if (AvatarURL && !isUrl(AvatarURL) && AvatarURL.startsWith('/')) {
        return window.location.origin + AvatarURL;
      }

      return AvatarURL;
    } catch (err) {
      return error(_module, `${_submodule}:getAvatarUrl`, null, err);
    }
  },

  /**
   * Gets the user account creation date and time in local string format.
   * @param {snowflake} userId User ID
   * @returns {string|undefined} User creation date and time
   */
  getCreatedAt: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return snowflake.getTimestamp(userId).toLocaleString();
    } catch (err) {
      return error(_module, `${_submodule}:getCreatedAt`, null, err);
    }
  },

  /**
   * Gets the user account creation timestamp.
   * @param {snowflake} userId User ID
   * @returns {string|undefined} User account creation timestamp
   */
  getCreatedTimestamp: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return snowflake.getTimestamp(userId);
    } catch (err) {
      return error(_module, `${_submodule}:getCreatedTimestamp`, null, err);
    }
  },

  /**
   * Gets the user discriminator (4 digit indentifier).
   * If no user ID is specified, tries to get the avatar string of the current user.
   * @param {snowflake} userId User ID
   * @returns {string|undefined} User discriminator
   */
  getDiscriminator: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return user.getUser(userId).discriminator;
    } catch (err) {
      return error(_module, `${_submodule}:getDiscriminator`, null, err);
    }
  },

  /**
   * Gets the last message the user sent (that's visible to your client).
   * @param {snowflake} userId User ID
   * @returns {?Message|undefined} Message object
   */
  getLastMessage: (userId) => {
    // @todo: Not sure how to check for this.
    return false;
  },

  /**
   * Gets the user note contents.
   * @param {snowflake} userId User ID
   * @returns {string|undefined} Note contents
   */
  getNote: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return getModule('getNote').getNote(userId).note;
    } catch (err) {
      return error(_module, `${_submodule}:getNote`, null, err);
    }
  },

  /**
   * Gets the user tag, which is a combination of the username and discriminator.
   * @param {snowflake} userId User ID
   * @returns {string|undefined} User tag
   */
  getTag: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return user.getUser(userId).tag;
    } catch (err) {
      return error(_module, `${_submodule}:getTag`, null, err);
    }
  },

  /**
   * Gets the user username.
   * @param {snowflake} userId User ID
   * @returns {string|undefined} User username
   */
  getUsername: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return user.getUser(userId).username;
    } catch (err) {
      return error(_module, `${_submodule}:getUsername`, null, err);
    }
  },

  /**
   * Checks if the user has an animated avatar.
   * @param {snowflake} userId User ID
   * @returns {boolean} Whether the user has an animated avatar
   */
  hasAnimatedAvatar: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      const User = user.getUser(userId);
      const ImageResolver = getModule('getUserAvatarURL', 'getGuildIconURL', 'hasAnimatedGuildIcon');

      return ImageResolver.hasAnimatedAvatar(User);
    } catch (err) {
      return error(_module, `${_submodule}:hasAnimatedAvatar`, null, err);
    }
  },

  /**
   * Checks if the user has a non-default avatar.
   * @param {snowflake} userId User ID
   * @returns {boolean} Whether the user has a non-default avatar
   */
  hasAvatar: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return Boolean(user.getUser(userId).avatar);
    } catch (err) {
      return error(_module, `${_submodule}:hasAvatar`, null, err);
    }
  },

  /**
   * Checks if the user has a Nitro (premium) subscription.
   * @param {snowflake} userId User ID
   * @returns {boolean} Whether the user has a Nitro subscription
   */
  hasNitro: (userId) => {
    // @todo: Not sure how to check for this.
    return false;
  },

  /**
   * Checks if the user is a bot.
   * @param {snowflake} userId User ID
   * @returns {boolean} Whether the user is a bot
   */
  isBot: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return user.getUser(userId).bot;
    } catch (err) {
      return error(_module, `${_submodule}:isBot`, null, err);
    }
  },

  /**
   * Checks if the user is a bug hunter.
   * @param {snowflake} userId User ID
   * @returns {boolean} Whether the user is a bug hunter
   */
  isBugHunter: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return user.getUser(userId).hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_1) || user.getUser(userId).hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_2);
    } catch (err) {
      return error(_module, `${_submodule}:isBugHunter`, null, err);
    }
  },

  /**
   * Checks if the user is a Discord partner.
   * @param {snowflake} userId User ID
   * @returns {boolean} Whether the user is a Discord partner
   */
  isPartner: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return user.getUser(userId).hasFlag(Constants.UserFlags.PARTNER);
    } catch (err) {
      return error(_module, `${_submodule}:isPartner`, null, err);
    }
  },

  /**
   * Checks if the user is a Discord staff member.
   * @param {snowflake} userId User ID
   * @returns {boolean} Whether the user is a Discord staff member
   */
  isStaff: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return user.getUser(userId).hasFlag(Constants.UserFlags.STAFF);
    } catch (err) {
      return error(_module, `${_submodule}:isStaff`, null, err);
    }
  },

  /**
   * Checks if the user is a system user.
   * @param {snowflake} userId User ID
   * @returns {boolean} Whether the user is a system user
   */
  isSystemUser: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return user.getUser(userId).system;
    } catch (err) {
      return error(_module, `${_submodule}:isSystemUser`, null, err);
    }
  },

  /**
   * Checks if the user is a verified bot.
   * @param {snowflake} userId User ID
   * @returns {boolean} Whether the user is a verified bot
   */
  isVerifiedBot: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return user.getUser(userId).hasFlag(Constants.UserFlags.VERIFIED_BOT);
    } catch (err) {
      return error(_module, `${_submodule}:isVerifiedBot`, null, err);
    }
  },

  /**
   * Checks if the user is a verified bot developer.
   * @param {snowflake} userId User ID
   * @returns {boolean} Whether the user is a verified bot developer
   */
  isVerifiedBotDev: (userId) => {
    try {
      // Check if the user ID is a string
      if (typeof userId !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
      }

      return user.getUser(userId).hasFlag(Constants.UserFlags.VERIFIED_DEVELOPER);
    } catch (err) {
      return error(_module, `${_submodule}:isVerifiedBotDev`, null, err);
    }
  }
};

module.exports = user;
