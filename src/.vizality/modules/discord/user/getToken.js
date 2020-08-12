const { getModule } = require('@webpack');

/**
 * Gets your user token.
 *
 * @warn What you do with this is entirely your own responsibility
 * @returns {(string|undefined)} User token or undefined
 */
const getToken = () => {
  try {
    const Token = getModule('getToken').getToken();

    return Token;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getToken;
