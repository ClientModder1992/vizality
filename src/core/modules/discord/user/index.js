const { string: { assertString, isUrl } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');

// const Constants = require('../module/constants');
// @todo Don't foreget to change this back.
const Constants = { ...getModule('Permissions', 'ActivityTypes', 'StatusTypes') };

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
    assertString(user.id);

    this._user = user;

    /**
     * Get the user ID.
     * @type {snowflake} The ID of the user
     * @name User#id
     * @readonly
     */
    this.id = user.id;

    /**
     * Gets the user username.
     * @type {string} The username of the user
     * @name User#username
     * @readonly
     */
    this.username = user.username;

    /**
     * Gets the user discriminator (4 digit indentifier).
     * @type {string} The discriminator of the user
     * @name User#discriminator
     * @readonly
     */
    this.discriminator = user.discriminator;

    /**
     * Gets the user tag, which is a combination of the username and discriminator.
     * @type {string} The tag of the user
     * @name User#tag
     * @readonly
     */
    this.tag = user.tag;

    /**
     * Gets the user avatar hash.
     * @see {@link https://discord.com/developers/docs/reference#image-formatting-image-base-url|Discord}
     * @type {string} The avatar hash of the user
     * @name User#avatar
     * @readonly
     */
    this.avatar = user.avatar;

    /**
     * Gets the user avatar URL.
     * @type {string} The avatar URL of the user
     * @name User#avatarUrl
     * @readonly
     */
    this.avatarUrl =
      // Check if the avatar URL exists, is not a valid URL, and starts with /
      user.avatarURL && !isUrl(user.avatarURL) && user.avatarURL.startsWith('/')
        ? window.location.origin + user.avatarURL
        : user.avatarURL;

    /**
     * Gets the user account creation timestamp.
     * @type {string} The user account creation timestamp
     * @name User#createdAtTimestamp
     * @readonly
     */
    this.createdAtTimestamp = Snowflake.getTimestamp(user.id);

    /**
     * Gets the user account creation date in local string format.
     * @type {string} When the user created their account in date format
     * @name User#createdAt
     * @readonly
     */
    this.createdAt = new Date(this.createdAtTimestamp);

    /**
     * Checks if the user has a non-default avatar.
     * @type {?boolean} Whether the user has a non-default avatar
     * @name User#hasAvatar
     * @readonly
     */
    this.hasAvatar =
      this.avatar !== 'undefined'
        ? Boolean(user.avatar)
        : null;

    /**
     * Checks if the user is a bot.
     * @type {?boolean} Whether or not the user is a bot
     * @name User#isBot
     * @readonly
     */
    this.isBot =
    user.bot !== 'undefined'
      ? Boolean(user.bot)
      : null;

    /**
     * Checks if this is an official Discord System user (part of the urgent message system)
     * @type {?boolean}
     * @name User#isSystem
     * @readonly
     */
    this.isSystem =
      user.system !== 'undefined'
        ? Boolean(user.system)
        : null;

    /**
     * Checks if the user is a bug hunter.
     * @type {?boolean}
     * @name User#isBugHunter
     * @readonly
     */
    this.isBugHunter =
      user.system !== 'undefined'
        ? Boolean(
          user.hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_1) ||
          user.hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_2))
        : null;

    /**
     * Checks if the user is a Discord Partner.
     * @type {?boolean}
     * @name User#isPartner
     * @readonly
     */
    this.isPartner = user.hasFlag(Constants.UserFlags.PARTNER);

    /**
     * Checks if the user is a Discord staff member.
     * @type {?boolean}
     * @name User#isStaff
     * @readonly
     */
    this.isStaff = user.hasFlag(Constants.UserFlags.STAFF);

    /**
     * Checks if the user is a verified bot.
     * @type {?boolean}
     * @name User#isVerifiedBot
     * @readonly
     */
    this.isVerifiedBot = user.hasFlag(Constants.UserFlags.VERIFIED_BOT);

    /**
     * Checks if the user is a verified bot developer.
     * @type {?boolean}
     * @name User#isVerifiedBotDev
     * @readonly
     */
    this.isVerifiedBotDev = user.hasFlag(Constants.UserFlags.VERIFIED_DEVELOPER);
  }

  /**
   * Creates an instance of the User class.
   * @param {object} user The user object
   * @returns {User|undefined} The User class instance
   * @private
   */
  static _get (user) {
    return new User(user);
  }

  /**
   * Gets the user object, and creates a User instance from it.
   * @param {snowflake} userId The user ID
   * @returns {object|undefined} The User class instance
   */
  static getUser (userId) {
    const user = getModule('getUser', 'getUsers').getUser(userId);
    if (user) return this._get(user);
  }

  /**
   * Gets the user object from their user tag, and creates a User instance from it.
   * @param {string} userTag The user tag
   * @returns {object|undefined} The User class instance
   */
  static getUserByTag (userTag) {
    const username = userTag.slice(0, -5);
    const discriminator = userTag.slice(-4);

    const user = getModule('getUser', 'getUsers').findByTag(username, discriminator);
    if (user) return this._get(user);
  }

  /**
   * Gets all of the currently cached user objects.
   * @returns {Collection<snowflake, object>} All cached user objects
   */
  static getUsers () {
    const users = getModule('getUser', 'getUsers').getUsers();
    if (users) return users;
  }

  /**
   * Gets all of the currently cached user IDs.
   * @returns {Array<snowflake>|undefined} All cached user IDs
   */
  static getUserIds () {
    const userIds = getModule('getStatus', 'getUserIds').getUserIds();
    if (userIds) return userIds;
  }

  /**
   * Checks if the user has a Nitro (premium) subscription, and if they do, gets how
   * long they've had it since in date format
   * @type {?Promise<Date>} Date
   * @name User#nitroSince
   * @readonly
   */
  get nitroSince () {
    return new Promise(async resolve => {
      const result = await getModule('getAPIBaseURL').get({
        url: `${Constants.Endpoints.USER_PROFILE(this.id)}`
      });

      resolve(new Date(Date.parse(result.body.premium_since)) || null);
    });
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
      const result = await getModule('getAPIBaseURL').get({
        url: `${Constants.Endpoints.USER_PROFILE(this.id)}`
      });

      resolve(new Date(Date.parse(result.body.premium_since)).getTime() || null);
    });
  }

  /**
   * Gets the last message (that's visible to your client) sent by the user.
   * @type {Message} The last message sent by the user
   * @name User#lastMessage
   * @readonly
   */
  get lastMessage () {
    return void 0;
  }

  /**
   * Gets the ID of the last message (that's visible to your client) sent by the user
   * @type {snowflake} The ID of the last message sent by the user
   * @name User#lastMessageId
   * @readonly
   */
  get lastMessageId () {
    return void 0;
  }

  /**
   * Gets the note contents of the user.
   * @type {Note} The note contents for the user
   * @name User#note
   * @readonly
   */
  get note () {
    return getModule('getNote').getNote(this.id);
  }

  /**
   * Checks if the user has an animated avatar.
   * @type {?boolean} Whether the user has an animated avatar
   * @name User#hasAnimatedAvatar
   * @readonly
   */
  get hasAnimatedAvatar () {
    const ImageResolver = getModule('hasAnimatedGuildIcon', 'getUserAvatarURL');
    const AnimatedAvatar = ImageResolver.hasAnimatedAvatar(this._user);

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
      const result = await getModule('getAPIBaseURL').get({
        url: `${Constants.Endpoints.USER_PROFILE(this.id)}`
      });

      resolve(Boolean(result.body.premium_since));
    });
  }
};
