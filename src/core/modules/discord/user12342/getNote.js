const { logger: { error } } = require('@util');
const { getModule } = require('@webpack');

/**
 * Gets the user's note contents.
 * @param {snowflake} [userId] - User ID
 * @returns {string|undefined} Note contents
 */
const getNote = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getNote';

  try {
    const NoteModule = getModule('getNote');
    return NoteModule.getNote(userId).note;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getNote;
