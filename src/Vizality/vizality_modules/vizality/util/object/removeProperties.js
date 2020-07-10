
/*
 * @todo:
 * Make this better. It doesn't work for nested objects/properties.
 *
 * i.e.
 * const obj = {
 *    fruits: {
 *      apple: 'yum'
 *    },
 *    vegetables: {
 *      peas: 'eww'
 *    }
 * }
 *
 * removeProperties(obj, 'fruits') will still return the normal, full obj object.
 */

const removeProperties = (object, ...propertyNames) => {
  return Object.keys(object)
    .filter(key => !propertyNames.includes(key))
    .reduce((accumulator, key) => ({ ...accumulator, [key]: object[key] }), {});
};

module.exports = removeProperties;
