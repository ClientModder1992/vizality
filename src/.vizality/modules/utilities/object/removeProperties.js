const removeProperties = (object, ...propertyNames) => {
  return Object.keys(object)
    .filter(key => !propertyNames.includes(key))
    .reduce((accumulator, key) => ({ ...accumulator, [key]: object[key] }), {});
};

module.exports = removeProperties;
