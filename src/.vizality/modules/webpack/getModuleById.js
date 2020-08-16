const _getModule = require('./_getModule');

/**
 * Grabs a React component by its display name
 * @param {String} displayName Component's display name.
 * @param {Boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
 * @param {Boolean} forever If Vizality should try to fetch the module forever. Should be used only if you're in early stages of startup.
 * @returns {Promise<object>|object} The component. A promise will always be returned, unless retry is false.
 */
const getModuleById = (id, retry = false, forever = false) => {
  return _getModule(m => m._dispatchToken && m._dispatchToken === `ID_${id}`, retry, forever, 'getModuleByDisplayName', id);
};

module.exports = getModuleById;
