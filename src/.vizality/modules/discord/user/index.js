/* eslint-disable brace-style */
const Webpack = require('@webpack');
const Util = require('@util');

// const Constants = require('../module/constants');
// @todo Don't foreget to change this back.
const Constants = {
  ...Webpack.getModule('Permissions', 'ActivityTypes', 'StatusTypes')
};

const Snowflake = require('../snowflake');

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
module.exports = class User {
  constructor (user) {
    Util.String.assertString(user.id);
    this._discordObject = user;
  }

  /**
   * Creates an instance of the User class.
   * @param {Object} user The user object
   * @returns {User|undefined} The User class instance
   * @private
   */
  static _get (user) {
    return new User(user);
  }

  /**
   * Gets the user object, and creates a User instance from it.
   * @param {snowflake} userId The user ID
   * @returns {Object|undefined} The User class instance
   */
  static getUser (userId) {
    const user = Webpack.getModule('getUser', 'getUsers').getUser(userId);
    if (user) return this._get(user);
  }

  /**
   * Gets the user object from their user tag, and creates a User instance from it.
   * @param {snowflake} userTag The user tag
   * @returns {Object|undefined} The User class instance
   */
  static getUserByTag (userTag) {
    const username = userTag.slice(0, -5);
    const discriminator = userTag.slice(-4);

    const user = Webpack.getModule('getUser', 'getUsers').findByTag(username, discriminator);
    if (user) return this._get(user);
  }

  /**
   * Gets all of the currently cached user objects.
   * @returns {Collection<snowflake, Object>} All cached user objects
   */
  static getUsers () {
    const users = Webpack.getModule('getUser', 'getUsers').getUsers();
    if (users) return users;
  }

  /**
   * Gets all of the currently cached user IDs.
   * @returns {Array<snowflake>|undefined} All cached user IDs
   */
  static getUserIds () {
    const usersIds = Webpack.getModule('getStatus', 'getUserIds').getUserIds();
    if (usersIds) return usersIds;
  }

  /**
   * Get the user id.
   * @type {snowflake} The IS of the user
   * @name User#id
   * @readonly
   */
  get id () { return this._discordObject.id; }

  /**
   * Gets the user username.
   * @type {string} The username of the user
   * @name User#username
   * @readonly
   */
  get username () { return this._discordObject.username; }

  /**
   * Gets the user discriminator (4 digit indentifier).
   * @type {string} The discriminator of the user
   * @name User#discriminator
   * @readonly
   */
  get discriminator () { return this._discordObject.discriminator; }

  /**
   * Gets the user tag, which is a combination of the username and discriminator.
   * @type {string} The tag of the user
   * @name User#tag
   * @readonly
   */
  get tag () { return this._discordObject.tag; }

  /**
   * Gets the user avatar hash.
   * @see {@link https://discord.com/developers/docs/reference#image-formatting-image-base-url|Discord}
   * @type {string} The avatar hash of the user
   * @name User#avatar
   * @readonly
   */
  get avatar () { return this._discordObject.avatar; }

  /**
   * Gets the user avatar URL.
   * @type {string} The avatar URL of the user
   * @name User#avatarUrl
   * @readonly
   */
  get avatarUrl () {
    const avatarUrl = this._discordObject.avatarURL;
    // Check if the avatar URL exists, is not a valid URL, and starts with /
    if (avatarUrl && !Util.String.isUrl(avatarUrl) && avatarUrl.startsWith('/')) {
      return window.location.origin + avatarUrl;
    }

    return avatarUrl;
  }

  /**
   * Checks if the user has a Nitro (premium) subscription, and if they do, gets how
   * long they've had it since in date format
   * @type {?Promise<Date>} Date
   * @name User#nitroSince
   * @readonly
   */
  get nitroSince () {
    return this.nitroSinceTimestamp.getTime();
  }

  /**
   * Checks if the user has a Nitro (premium) subscription, and if they do, gets how
   * long they've had it since in timestamp format
   * @type {?Promise<Date>} Timestamp
   * @name User#nitroSinceTimestamp
   * @readonly
   */
  get nitroSinceTimestamp () {
    return new Promise(async resolve => {
      const result = await Webpack.getModule('getAPIBaseURL').get({
        url: `${Constants.Endpoints.USER_PROFILE(this.id)}`
      });

      resolve(new Date(Date.parse(result.body.premium_since)) || null);
    });
  }

  /**
   * Gets the user account creation date in local string format.
   * @type {string} When the user created their account in date format
   * @name User#createdAt
   * @readonly
   */
  get createdAt () { return new Date(this.createdAtTimestamp); }

  /**
   * Gets the user account creation timestamp.
   * @type {string} The user account creation timestamp
   * @name User#createdAtTimestamp
   * @readonly
   */
  get createdAtTimestamp () { return Snowflake.getTimestamp(this.id); }

  /**
   * Gets the last message (that's visible to your client) sent by the user.
   * @type {Message} The last message sent by the user
   * @name User#lastMessage
   * @readonly
   */
  get lastMessage () { return void 0; }

  /**
   * Gets the ID of the last message (that's visible to your client) sent by the user
   * @type {snowflake} The ID of the last message sent by the user
   * @name User#lastMessageId
   * @readonly
   */
  get lastMessageId () { return void 0; }

  /**
   * Gets the note contents of the user.
   * @type {Note} The note contents for the user
   * @name User#note
   * @readonly
   */
  get note () { return Webpack.getModule('getNote').getNote(this.id); }

  /**
   * Checks if the user has a non-default avatar.
   * @type {?boolean} Whether the user has a non-default avatar
   * @name User#hasAvatar
   * @readonly
   */
  get hasAvatar () {
    return this.avatar !== 'undefined'
      ? Boolean(this.avatar)
      : null;
  }

  /**
   * Checks if the user has an animated avatar.
   * @type {?boolean} Whether the user has an animated avatar
   * @name User#hasAnimatedAvatar
   * @readonly
   */
  get hasAnimatedAvatar () {
    const ImageResolver = Webpack.getModule('hasAnimatedGuildIcon', 'getUserAvatarURL');
    const AnimatedAvatar = ImageResolver.hasAnimatedAvatar(this._discordObject);

    return AnimatedAvatar !== 'undefined'
      ? Boolean(AnimatedAvatar)
      : null;
  }

  /**
   * Checks if the user has a Nitro (premium) subscription.
   * @type {Promise<boolean>} Whether or not the user has a Nitro subscription
   * @name User#isNitro
   * @readonly
   */
  get isNitro () {
    return new Promise(async resolve => {
      const result = await Webpack.getModule('getAPIBaseURL').get({
        url: `${Constants.Endpoints.USER_PROFILE(this.id)}`
      });

      resolve(Boolean(result.body.premium_since));
    });
  }

  /**
   * Checks if the user is a bot.
   * @type {?boolean} Whether or not the user is a bot
   * @name User#isBot
   * @readonly
   */
  get isBot () {
    return this._discordObject.bot !== 'undefined'
      ? Boolean(this._discordObject.bot)
      : null;
  }

  /**
   * Checks if this is an official Discord System user (part of the urgent message system)
   * @type {?boolean}
   * @name User#isSystem
   * @readonly
   */
  get isSystem () {
    return this._discordObject.system !== 'undefined'
      ? Boolean(this._discordObject.system)
      : null;
  }

  /**
   * Checks if the user is a bug hunter.
   * @type {?boolean}
   * @name User#isBugHunter
   * @readonly
   */
  get isBugHunter () {
    return this._discordObject.system !== 'undefined'
      ? Boolean(
        this._discordObject.hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_1) ||
        this._discordObject.hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_2))
      : null;
  }

  /**
   * Checks if the user is a Discord Partner.
   * @type {?boolean}
   * @name User#isPartner
   * @readonly
   */
  get isPartner () { return this._discordObject.hasFlag(Constants.UserFlags.PARTNER); }

  /**
   * Checks if the user is a Discord staff member.
   * @type {?boolean}
   * @name User#isStaff
   * @readonly
   */
  get isStaff () { return this._discordObject.hasFlag(Constants.UserFlags.STAFF); }

  /**
   * Checks if the user is a verified bot.
   * @type {?boolean}
   * @name User#isVerifiedBot
   * @readonly
   */
  get isVerifiedBot () { return this._discordObject.hasFlag(Constants.UserFlags.VERIFIED_BOT); }

  /**
   * Checks if the user is a verified bot developer.
   * @type {?boolean}
   * @name User#isVerifiedBotDev
   * @readonly
   */
  get isVerifiedBotDev () { return this._discordObject.hasFlag(Constants.UserFlags.VERIFIED_DEVELOPER); }
};
