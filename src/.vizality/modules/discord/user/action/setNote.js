const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const isValidId = require('../../utility/isValidId');

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

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  // Check if the user note is a valid string
  if (typeof note !== 'string') {
    return error(_module, _submodule, null, `Note '${note}' is not a valid string.`);
  }

  try {
    const UpdateNoteModule = getModule('updateNote');
    return UpdateNoteModule.updateNote(userId, note);
  } catch (err) {
    if (err.body.message) {
      return error(_module, _submodule, null, `There was an error setting the user note:`, err.body.message);
    }

    return error(_module, _submodule, null, 'There was an error setting the user note.');
  }
};

module.exports = setNote;
