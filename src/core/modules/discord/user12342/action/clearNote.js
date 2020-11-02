const { logger: { error } } = require('@util');

const setNote = require('./setNote');

/**
 * Clears a user's note.
 * @memberof discord.user.action
 * @param {snowflake} userId User ID
 * @returns {void}
 */
const clearNote = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Action:clearUserNote';

  // Check if user ID is a string
  if (typeof userId !== 'string') {
    throw new TypeError(`"userId" argument must be a string (received ${typeof userId})`);
  }

  try {
    return setNote(userId, null);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = clearNote;
