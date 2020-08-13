const { v4: uuidv4 } = require('uuid');

const generateUuidv4 = () => {
  return uuidv4();
};

module.exports = generateUuidv4;
