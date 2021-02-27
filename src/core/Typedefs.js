/* eslint-disable spaced-comment */ /* eslint-disable multiline-comment-style */
/**
 * All of the custom typings used throughout the project. I'm keeping them all stored in a
 * single file, because it seems I have to keep this file opened while working on the
 * project in order to get proper intellisense for custom types in VSCode. I have spent
 * hours trying various way to import the typedefs and have had no luck, so this is my
 * solution. In order for it to work, I also had to add the path of the typedefs file
 * to jsconfig.json.
 * @namespace typedefs
 * @module typedefs
 */

//==============================================================================
// Vizality
//==============================================================================
/**
 * @typedef VizalityAPI
 * @property {CommandsAPI} commands
 * @property {SettingsAPI} settings
 * @property {NoticesAPI} notices
 * @property {KeybindsAPI} keybinds
 * @property {RoutesAPI} routes
 * @property {ConnectionsAPI} connections
 * @property {I18nAPI} i18n
 * @property {RPCAPI} rpc
 */
/**
 * @typedef Git
 * @property {string} upstream
 * @property {string} branch
 * @property {string} revision
 */
/**
 * Main Vizality class
 * @typedef Vizality
 * @property {VizalityAPI} api
 * @property {AddonManager} manager
 * @property {APIManager} apiManager
 * @property {Git} git
 * @property {boolean} _initialized
 * @global
 */

//==============================================================================
// Discord Module
//==============================================================================
//--------------
// Misc
//--------------
/**
 * An object with key value pairs where the key is usually a string (snowflake) and the
 * value is usually an object.
 * @typedef {Object<key, value>} Collection
 */

//--------------
// Emoji
//--------------
/**
 * Emoji
 * @typedef {CustomEmoji|DefaultEmoji} Emoji
 * @see {@link discord.emoji}
 */
/**
 * Emoji that have been uploaded to a guild.
 * @typedef {Object} CustomEmoji
 * @property {?string} allNameString Emoji name with colons included (can be null only in
 * reaction emoji objects)
 * @property {?string|Array} [name] Emoji name (can be null only in reaction emoji objects).
 * Non-custom (guild) emoji have array names, because they may have more than one name (aliases).
 * @property {snowflake} guildId Guild ID where the emoji was created
 * @property {snowflake} [id] Emoji ID. Non-custom (guild) emoji do not have an ID.
 * @property {boolean} managed Whether the emoji is managed
 * @property {boolean} available Whether the emoji is available
 * @property {boolean} animated Whether the emoji is animated
 * @see {@link discord.emoji.guild}
 */
/**
 * "Default" emoji that are inherent to Discord. There are 1741 at the time of writing this.
 * @typedef {Object} DefaultEmoji
 * @property {}
 * @see {@link discord.emoji.default}
 */

//--------------
// User
//--------------
/**
 *
 * @typedef {Object} User
 * @property {}
 * @see {@link discord.user}
 */

//--------------
// Message
//--------------
/**
 *
 * @typedef {Object} Message
 * @property {}
 * @see {@link discord.message}
 */
/**
 *
 * @typedef {Object} Attachment
 * @property {}
 * @see {@link discord.message.attachment}
 */
/**
 *
 * @typedef {Object} Embed
 * @property {}
 * @see {@link discord.message.embed}
 */

//--------------
// Settings
//--------------
/**
 *
 * @typedef {Object} UserSetting
 * @property {}
 * @see {@link discord.settings.user}
 */

//--------------
// Guild
//--------------
/**
 * Guilds in Discord represent an isolated collection of users and channels, and are often
 * referred to as "servers" in the Discord UI.
 * <info>It's recommended to see if a guild is available before performing operations or
 * reading data from it. You can check this with @see {@link discord.guild#isAvailable}.
 * Reasons it may be unavailable are an outage or not currently cached.</info>
 * @typedef {Object} Guild
 */

/**
 *
 * @typedef {Object} Member
 */
/**
 *
 * @typedef {Object} Role
 * @property {}
 * @see {@link discord.guild.role}
 */

//--------------
// Channel
//--------------

/**
 *
 * @typedef {Object} Channel
 */

//--------------
// Activity
//--------------
/**
 *
 * @typedef {Object} Activity
 */


//--------------
// Snowflake
//--------------
/**
 * A Twitter snowflake, except the epoch is 2015-01-01T00:00:00.000Z
 * ```
 * If we have a snowflake '266241948824764416' we can represent it as binary:
 *
 * 64                                          22     17     12         0
 * 000000111011000111100001101001000101000000  00001  00000  000000000000
 * number of ms since Discord epoch            worker pid    increment
 * ```
 * @see {@link https://discord.js.org|discord.js}
 * @typedef {string} snowflake
 */
/**
 * A deconstructed snowflake.
 * @see {@link https://discord.js.org|discord.js}
 * @typedef {Object} DeconstructedSnowflake
 * @property {number} timestamp Timestamp the snowflake was created
 * @property {Date} date Date the snowflake was created
 * @property {number} workerID Worker ID in the snowflake
 * @property {number} processID Process ID in the snowflake
 * @property {number} increment Increment in the snowflake
 * @property {string} binary Binary representation of the snowflake
 */

//==============================================================================
// Webpack Module
//==============================================================================
/**
 * @typedef {Object} WebpackModule
 * @property {string} test
 */

//==============================================================================
// Util Module
//==============================================================================
//--------------
// Logger
//--------------
/**
 * @typedef Util.Logger.label
 * @type {Object}
 * @property {string} text Text to show in the label
 * @property {string} color Color string in any format (without alpha)
 */

//==============================================================================
// APIs
//==============================================================================
