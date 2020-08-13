const { validate } = require('uuid');

const isUuid = (uuid) => {
  return validate(uuid);
};

module.exports = isUuid;
