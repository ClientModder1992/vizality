const { logger: { warn } } = require('@util');
const { getModule } = require('@webpack');

const setSetting = async (setting, value, sync = true) => {
  const module = 'Module';
  const submodule = 'Discord:settings:setSetting';

  const settings = getModule('renderEmbeds', 'renderReactions', 'renderSpoilers');
  const moreSettings = getModule('darkSidebar', 'fontScale', 'fontSize');

  /*
   * `updateRemoteSettings` must be written this way instead of using destructuring
   * because in the `updateRemoteSettings` function, Discord uses `this` to reference
   * the function's self and call the `updateLocalSettings` function.
   */
  const updateRemoteSettings = getModule('updateRemoteSettings');
  const { updateLocalSettings } = getModule('updateLocalSettings');

  // Error handling
  const fix = `Use 'Discord:settings:getSettingInfo()' to see appropriate options.`;

  if (!setting || typeof setting !== 'string' || (!settings[setting] && !moreSettings[setting])) {
    // @todo throw new TypeError(`"note" argument must be a string (received ${typeof note})`); format
    return warn(module, submodule, null, `You must enter a valid setting name of type string. ${fix}`);
  }

  if (!value) {
    // @todo throw new TypeError(`"note" argument must be a string (received ${typeof note})`); format
    return warn(module, submodule, null, `You must enter a valid value for '${setting}'. ${fix}`);
  }

  if (sync === true) {
    return updateRemoteSettings.updateRemoteSettings({ [setting]: value });
  }

  return updateLocalSettings({ [setting]: value });
};

module.exports = setSetting;
