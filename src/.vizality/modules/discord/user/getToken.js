const { getModule } = require('@webpack');

/**
 * Gets your user token.
 *
 * @warn What you do with this is entirely your own responsibility
 * @returns {(string|undefined)} User token or undefined
 */
const getToken = () => {
  const Token = getModule('getToken').getToken();

  return Token;
};

module.exports = getToken;
