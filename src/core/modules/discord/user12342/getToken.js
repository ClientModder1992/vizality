const { logger: { error } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');

/**
 * Gets your user token.
 * @warn **What you do with this is entirely your own responsibility**
 * @returns {string|undefined} - User token
 */
const getToken = () => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getToken';

  try {
    const TokenModule = getModule('getToken');
    return TokenModule.getToken();
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getToken;
