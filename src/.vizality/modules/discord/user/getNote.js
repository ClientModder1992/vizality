const { getModule } = require('@webpack');

const isValidId = require('../utility/isValidId');

/**
 * Gets the user's note contents.
 *
 * @param {string} [userId] - User ID
 * @returns {(string|undefined)} Note contents or undefined
 */
const getNote = (userId) => {
  const _submodule = 'Discord:User:getNote';

  // Checks if user ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const NoteModule = getModule('getNote');
    return NoteModule.getNote(userId).note;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getNote;
