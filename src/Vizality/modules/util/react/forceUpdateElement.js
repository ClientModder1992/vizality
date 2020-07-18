const getOwnerInstance = require('./getOwnerInstance');

const forceUpdateElement = (query, all = false) => {
  const elements = all ? [ ...document.querySelectorAll(query) ] : [ document.querySelector(query) ];

  return elements.filter(Boolean).forEach(element => {
    getOwnerInstance(element).forceUpdate();
  });
};

module.exports = forceUpdateElement;
