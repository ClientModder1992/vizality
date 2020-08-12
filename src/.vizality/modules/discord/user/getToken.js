const { getModule } = require('@webpack');

/**
 * Gets your user token.
 *
 * @warn What you do with this is entirely your own responsibility
 * @returns {string} User token
 */
const getToken = () => {
  const Token = getModule('getToken').getToken();

  return Token;
};

module.exports = getToken;
