const { getModule } = require('@webpack');

const getToken = () => {
  const Token = getModule('getToken').getToken();

  return Token;
};

module.exports = getToken;
