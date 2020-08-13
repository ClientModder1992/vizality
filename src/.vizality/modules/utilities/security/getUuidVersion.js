const { version, validate } = require('uuid');

const getUuidVersion = (uuid) => {
  if (validate(uuid)) {
    return version(uuid);
  }

  return console.log('error');
};

module.exports = getUuidVersion;
