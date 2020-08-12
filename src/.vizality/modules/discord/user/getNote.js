const { getModule } = require('@webpack');

const isValidId = require('../utilities/isValidId');

/**
 * Gets the user's note contents.
 *
 * @param {string} [userId] - User ID
 * @returns {(string|undefined)} Note contents or undefined
 */
const getNote = (userId) => {
  const _submodule = 'Discord:User:getNote';

  // Checks if user ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) {
    return;
  }

  try {
    const Note = getModule('getNote').getNote(userId).note;

    return Note;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getNote;
