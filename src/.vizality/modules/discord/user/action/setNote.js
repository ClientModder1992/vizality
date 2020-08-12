const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const setNote = (userId, note) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Action:setUserNote';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

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
