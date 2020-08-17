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

  try {
    // Check if user ID is a string
    if (typeof userId !== 'string') {
      throw new TypeError(`"userId" argument must be a string (received ${typeof userId})`);
    }

    // Check if the note is a string
    if (typeof note !== 'string') {
      throw new TypeError(`"note" argument must be a string (received ${typeof note})`);
    }

    const UpdateNoteModule = getModule('updateNote');
    return UpdateNoteModule.updateNote(userId, note);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = setNote;
