/*
 * @todo: Consider reworking this code... As it stands,
 * if the element doesn't exist, it just keeps running
 * forever...
 */

const sleep = require('../sleep');

const waitForElement = async (querySelector) => {
  let elem;

  while (!(elem = document.querySelector(querySelector))) {
    await sleep(1);
  }

  return elem;
};

module.exports = waitForElement;
