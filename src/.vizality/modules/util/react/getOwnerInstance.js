const getReactInstance = require('./getReactInstance');

const getOwnerInstance = (node) => {
  for (let curr = getReactInstance(node); curr; curr = curr.return) {
    const owner = curr.stateNode;
    if (owner && !(owner instanceof HTMLElement)) {
      return owner;
    }
  }

  return null;
};

module.exports = getOwnerInstance;
