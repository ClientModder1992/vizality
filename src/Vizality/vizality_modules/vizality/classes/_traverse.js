const classes = require('../classes');

const _traverse = function* (targetValue, exactMatch = false, currentPath = '', object = classes) {
  if (typeof object !== 'object') {
    return false;
  }

  let matchedKeys;

  if (exactMatch) {
    matchedKeys = Object.keys(object).filter(key => object[key] === targetValue);
  } else {
    matchedKeys = Object.keys(object).filter(key => typeof object[key] === 'string' && object[key].includes(targetValue));
  }

  if (matchedKeys[0]) {
    yield *matchedKeys.map(key => currentPath ? `${currentPath}.${key}` : key);
  }

  for (const key in object) {
    const found = _traverse(targetValue, exactMatch, currentPath ? `${currentPath}.${key}` : key, object[key]);
    if (found) {
      yield *found;
    }
  }
};

module.exports = _traverse;
