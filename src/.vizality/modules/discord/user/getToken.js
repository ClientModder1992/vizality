const { getModule } = require('@webpack');

/**
 * Gets your user token.
 *
 * @warn What you do with this is entirely your own responsibility
 * @returns {(string|undefined)} User token or undefined
 */
const getToken = () => {
  try {
    const TokenModule = getModule('getToken');
    return TokenModule.getToken();
  } catch (err) {
    // Fail silently
  }
};

module.exports = getToken;
