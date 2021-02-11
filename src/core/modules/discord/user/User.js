/* eslint-disable no-unused-vars */
import { isUrl, assertString } from '@vizality/util/string';
import { log, warn, error } from '@vizality/util/logger';
import { getModule } from '@vizality/webpack';
import typedefs from '@vizality/typedefs';

import Constants from '../module/constants';
import snowflake from '../snowflake';

/**
 * Contains functions/data relating to users.
 * Users in Discord are generally considered the base entity. Users can spawn across the
 * entire platform, be members of guilds, participate in text and voice chat, and much
 * more. Users are separated by a distinction of "bot" vs "normal." Although they are
 * similar, bot users are automated users that are "owned" by another user. Unlike normal
 * users, bot users do not have a limitation on the number of guilds they can be a part of.
 * Reference: @see {@link https://discord.com/developers/docs/resources/user|Discord}
 * @namespace discord.user
 * @module discord.user
 * @memberof discord
 */

const _module = 'Discord';
const _submodule = 'User';

const _log = (...data) => log({ module: _module, submodule: _submodule }, ...data);
const _warn = (...data) => warn({ module: _module, submodule: _submodule }, ...data);
const _error = (...data) => error({ module: _module, submodule: _submodule }, ...data);

/**
 * Gets the user object.
 * @param {snowflake} userId User ID
 * @returns {User|undefined} User object
 */
export const getUser = userId => {
  try {
    assertString(userId);
    return getModule('getUser', 'getUsers').getUser(userId);
  } catch (err) {
    return _error(err);
  }
};

/**
 * Gets the user object from their user tag.
 * @param {string} userTag User tag
 * @returns {User|undefined} User object
 */
export const getUserByTag = userTag => {
  try {
    assertString(userTag);
    const username = userTag.slice(0, -5);
    const discriminator = userTag.slice(-4);
    return getModule('getUser', 'getUsers').findByTag(username, discriminator);
  } catch (err) {
    return _error(err);
  }
};

/**
 * Gets all of the currently cached user objects.
 * @returns {Collection<snowflake, User>} All cached user objects
 */
export const getUsers = () => {
  try {
    return getModule('getUser', 'getUsers').getUsers();
  } catch (err) {
    return _error(err);
  }
};

/**
 * Gets all of the currently cached user IDs.
 * @returns {Array<snowflake>|undefined} All cached user IDs
 */
export const getUserIds = () => {
  try {
    return getModule('getStatus', 'getUserIds').getUserIds();
  } catch (err) {
    return _error(err);
  }
};

/**
 * Gets the user's avatar hash. @see {@link https://discord.com/developers/docs/reference#image-formatting-image-base-url|Discord}
 * If no user ID is specified, tries to get the avatar string of the current user.
 * @param {snowflake} userId User ID
 * @returns {string|undefined} User avatar string
 */
export const getAvatar = userId => {
  try {
    assertString(userId);
    return this.getUser(userId).avatar;
  } catch (err) {
    return _error(err);
  }
};

/**
 * Gets the user avatar URL.
 * @param {snowflake} [userId] User ID
 * @returns {string|undefined} User avatar URL
 */
export const getAvatarUrl = userId => {
  try {
    assertString(userId);
    const AvatarURL = this.getUser(userId).avatarURL;
    // Check if the avatar URL exists, is not a valid URL, and starts with /
    if (AvatarURL && !isUrl(AvatarURL) && AvatarURL.startsWith('/')) {
      return window.location.origin + AvatarURL;
    }
    return AvatarURL;
  } catch (err) {
    return _error(err);
  }
};

/**
 * Gets the user account creation date and time in local string format.
 * @param {snowflake} userId User ID
 * @returns {string|undefined} User creation date and time
 */
export const getCreatedAt = userId => {
  try {
    assertString(userId);
    return snowflake.getTimestamp(userId).toLocaleString();
  } catch (err) {
    return _error(err);
  }
};

/**
 * Gets the user account creation timestamp.
 * @param {snowflake} userId User ID
 * @returns {string|undefined} User account creation timestamp
 */
export const getCreatedTimestamp = userId => {
  try {
    assertString(userId);
    return snowflake.getTimestamp(userId);
  } catch (err) {
    return _error(err);
  }
};

/**
 * Gets the user discriminator (4 digit indentifier).
 * If no user ID is specified, tries to get the avatar string of the current user.
 * @param {snowflake} userId User ID
 * @returns {string|undefined} User discriminator
 */
export const getDiscriminator = userId => {
  try {
    assertString(userId);
    return this.getUser(userId).discriminator;
  } catch (err) {
    return _error(err);
  }
};

/**
 * Gets the last message the user sent (that's visible to your client).
 * @param {snowflake} userId User ID
 * @returns {?Message|undefined} Message object
 */
export const getLastMessage = userId => {
  // @todo: Not sure how to check for this yet.
  return void 0;
};

/**
 * Gets the user note contents.
 * @param {snowflake} userId User ID
 * @returns {string|undefined} Note contents
 */
export const getNote = userId => {
  try {
    assertString(userId);
    return getModule('getNote').getNote(userId).note;
  } catch (err) {
    return _error(err);
  }
};

/**
 * Gets the user tag, which is a combination of the username and discriminator.
 * @param {snowflake} userId User ID
 * @returns {string|undefined} User tag
 */
export const getTag = userId => {
  try {
    assertString(userId);
    return this.getUser(userId).tag;
  } catch (err) {
    return _error(err);
  }
};

/**
 * Gets the user username.
 * @param {snowflake} userId User ID
 * @returns {string|undefined} User username
 */
export const getUsername = userId => {
  try {
    assertString(userId);
    return this.getUser(userId).username;
  } catch (err) {
    return _error(err);
  }
};

/**
 * Checks if the user has an animated avatar.
 * @param {snowflake} userId User ID
 * @returns {boolean} Whether the user has an animated avatar
 */
export const hasAnimatedAvatar = userId => {
  try {
    assertString(userId);
    const User = this.getUser(userId);
    const ImageResolver = getModule('getUserAvatarURL', 'getGuildIconURL', 'hasAnimatedGuildIcon');
    return ImageResolver.hasAnimatedAvatar(User);
  } catch (err) {
    return _error(err);
  }
};

/**
 * Checks if the user has a non-default avatar.
 * @param {snowflake} userId User ID
 * @returns {boolean} Whether the user has a non-default avatar
 */
export const hasAvatar = userId => {
  try {
    assertString(userId);
    return Boolean(this.getUser(userId).avatar);
  } catch (err) {
    return _error(err);
  }
};

/**
 * Checks if the user has a Nitro (premium) subscription.
 * @param {snowflake} userId User ID
 * @returns {boolean} Whether the user has a Nitro subscription
 */
export const hasNitro = userId => {
  return new Promise(async resolve => {
    const result = await getModule('getAPIBaseURL').get({
      url: `${Constants.Endpoints.USER_PROFILE(userId)}`
    });

    resolve(Boolean(result.body.premium_since));
  });
};

/**
 * Checks if the user is a bot.
 * @param {snowflake} userId User ID
 * @returns {boolean} Whether the user is a bot
 */
export const isBot = userId => {
  try {
    assertString(userId);
    return this.getUser(userId).bot;
  } catch (err) {
    return _error(err);
  }
};

/**
 * Checks if the user is a bug hunter.
 * @param {snowflake} userId User ID
 * @returns {boolean} Whether the user is a bug hunter
 */
export const isBugHunter = userId => {
  try {
    assertString(userId);
    return Boolean(
      this.getUser(userId).hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_1) ||
      this.getUser(userId).hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_2)
    );
  } catch (err) {
    return _error(err);
  }
};

/**
 * Checks if the user is a Discord partner.
 * @param {snowflake} userId User ID
 * @returns {boolean} Whether the user is a Discord partner
 */
export const isPartner = userId => {
  try {
    assertString(userId);
    return this.getUser(userId).hasFlag(Constants.UserFlags.PARTNER);
  } catch (err) {
    return _error(err);
  }
};

/**
 * Checks if the user is a Discord staff member.
 * @param {snowflake} userId User ID
 * @returns {boolean} Whether the user is a Discord staff member
 */
export const isStaff = userId => {
  try {
    assertString(userId);
    return this.getUser(userId).hasFlag(Constants.UserFlags.STAFF);
  } catch (err) {
    return _error(err);
  }
};

/**
 * Checks if the user is a system user.
 * @param {snowflake} userId User ID
 * @returns {boolean} Whether the user is a system user
 */
export const isSystemUser = userId => {
  try {
    assertString(userId);
    return this.getUser(userId).system;
  } catch (err) {
    return _error(err);
  }
};

/**
 * Checks if the user is a verified bot.
 * @param {snowflake} userId User ID
 * @returns {boolean} Whether the user is a verified bot
 */
export const isVerifiedBot = userId => {
  try {
    assertString(userId);
    return this.getUser(userId).hasFlag(Constants.UserFlags.VERIFIED_BOT);
  } catch (err) {
    return _error(err);
  }
};

/**
 * Checks if the user is a verified bot developer.
 * @param {snowflake} userId User ID
 * @returns {boolean} Whether the user is a verified bot developer
 */
export const isVerifiedBotDev = userId => {
  try {
    assertString(userId);
    return this.getUser(userId).hasFlag(Constants.UserFlags.VERIFIED_DEVELOPER);
  } catch (err) {
    return _error(err);
  }
};
