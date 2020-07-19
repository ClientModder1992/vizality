/*
 * @todo: Think about renaming this... Maybe
 * waitForElement or something a bit more descriptive.
 * Also considering reworking the code... As it stands,
 * if the element doesn't exist, it just keeps running
 * forever.
 */

const sleep = require('../sleep');

const waitFor = async (querySelector) => {
  let elem;

  while (!(elem = document.querySelector(querySelector))) {
    await sleep(1);
  }

  return elem;
};

module.exports = waitFor;
