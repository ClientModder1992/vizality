const { logger: { error } } = require('@utilities');

const setNote = require('./setNote');

const clearNote = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Action:clearUserNote';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  try {
    return setNote(userId, '');
  } catch (err) {
    return error(_module, _submodule, null, `There was an error clearing the user note:`, err.body.message);
  }
};

module.exports = clearNote;
