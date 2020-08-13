const { logger: { error } } = require('@utilities');

const isValidId = require('../../utility/isValidId');
const setNote = require('./setNote');

/**
 * Clears the user's note contents.
 *
 * @param {string} userId - User ID
 * @returns {undefined} Action
 */
const clearNote = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Action:clearUserNote';

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    return setNote(userId, null);
  } catch (err) {
    return error(_module, _submodule, null, `There was an error clearing the user note:`, err.body.message);
  }
};

module.exports = clearNote;
