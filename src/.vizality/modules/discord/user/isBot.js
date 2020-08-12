const getUser = require('./getUser');

const isBot = (userId = '') => {
  if (!userId) {
    return getUser().bot;
  }

  return getUser(userId, 'bot');
};

module.exports = isBot;
