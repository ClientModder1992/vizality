const _traverseValues = function* (object, targetValue, exactMatch = false, currentPath = '') {
  if (typeof object !== 'object') {
    return false;
  }

  targetValue = targetValue.toLowerCase();

  let matchedKeys;

  if (exactMatch) {
    matchedKeys = Object.keys(object).filter(key => object[key] === targetValue);
  } else {
    matchedKeys = Object.keys(object).filter(key => typeof object[key] === 'string' && object[key].toLowerCase().includes(targetValue));
  }

  if (matchedKeys[0]) {
    yield *matchedKeys.map(key => currentPath ? `${currentPath}.${key}` : key);
  }

  for (const key in object) {
    const found = _traverseValues(object[key], targetValue, exactMatch, currentPath ? `${currentPath}.${key}` : key);
    if (found) {
      yield *found;
    }
  }
};

module.exports = _traverseValues;
