const getModule = require('./getModule');

/**
 * Grabs a React component by its display name
 * @param {String} displayName Component's display name.
 * @param {Boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
 * @param {Boolean} forever If Vizality should try to fetch the module forever. Should be used only if you're in early stages of startup.
 * @returns {Promise<object>|object} The component. A promise will always be returned, unless retry is false.
 */
const getModuleByDisplayName = (displayName, retry = true, forever = false) => {
  return getModule(m => m.displayName && m.displayName.toLowerCase() === displayName.toLowerCase(),
    retry,
    forever,
    'getModuleByDisplayName',
    displayName
  );
};

module.exports = getModuleByDisplayName;
