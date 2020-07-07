const sleep = require('../sleep');

const waitFor = async (querySelector) => {
  let elem;

  while (!(elem = document.querySelector(querySelector))) {
    await sleep(1);
  }

  return elem;
};

module.exports = waitFor;
