const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

/**
 * Gets the user's note contents.
 *
 * @param {string} [userId] - User ID
 * @returns {(string|undefined)} Note contents or undefined
 */
const getNote = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getNote';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  try {
    const Note = getModule('getNote').getNote(userId).note;

    return Note;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getNote;
