const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

/**
 * Sets a user's note contents.
 *
 * @param {string} userId - User ID
 * @param {string} note - User note
 * @returns {undefined} Action
 */
const setNote = (userId, note) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Action:setNote';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  // Check if the user note is a valid string
  if (typeof note !== 'string') {
    return error(_module, _submodule, null, `Note must be a valid string.`);
  }

  const { updateNote } = getModule('updateNote');

  try {
    return updateNote(userId, note);
  } catch (err) {
    return error(_module, _submodule, null, `There was an error setting the user note:`, err.body.message);
  }
};

module.exports = setNote;
