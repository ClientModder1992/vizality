const _traverse = function* (object, targetValue, exactMatch = false, type, currentPath = '') {
  if (typeof object !== 'object') {
    return false;
  }

  targetValue = targetValue.toLowerCase();

  let matchedKeys;

  if (exactMatch) {
    if (type === 'key') {
      matchedKeys = Object.keys(object).filter(key => key.toLowerCase() === targetValue);
    } else if (type === 'value') {
      matchedKeys = Object.keys(object).filter(key => object[key] === targetValue);
    } if (type === 'all') {
      matchedKeys = Object.keys(object).filter(key => key.toLowerCase() === targetValue || object[key] === targetValue);
    } else {

    }
  } else {
    if (type === 'key') {
      matchedKeys = Object.keys(object).filter(key => key.toLowerCase().includes(targetValue));
    } else if (type === 'value') {
      matchedKeys = Object.keys(object).filter(key => typeof object[key] === 'string' && object[key].toLowerCase().includes(targetValue));
    } if (type === 'all') {
      matchedKeys = Object.keys(object).filter(key =>
        key.toLowerCase().includes(targetValue) || (typeof object[key] === 'string' && object[key].toLowerCase().includes(targetValue))
      );
    } else {

    }
  }

  if (matchedKeys[0]) {
    yield *matchedKeys.map(key => currentPath ? `${currentPath}.${key}` : key);
  }

  for (const key in object) {
    const found = _traverse(object[key], targetValue, exactMatch, type, currentPath ? `${currentPath}.${key}` : key);
    if (found) {
      yield *found;
    }
  }
};

module.exports = _traverse;
