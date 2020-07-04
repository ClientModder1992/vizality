const { sleep } = require('vizality/util');

module.exports = async (querySelector) => {
  let elem;

  while (!(elem = document.querySelector(querySelector))) {
    await sleep(1);
  }

  return elem;
};
