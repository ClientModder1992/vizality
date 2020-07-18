/* eslint-disable prefer-const */

const { getModule } = require('vizality/webpack');
const { logger: { warn } } = require('vizality/util');

const setSetting = async (setting, value, sync = true) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Discord:settings:setSetting';

  const settings = getModule('renderEmbeds', 'renderReactions', 'renderSpoilers');
  const moreSettings = getModule('darkSidebar', 'fontScale', 'fontSize');

  /*
   * `updateRemoteSettings` has to be written this way instead of using destructuring
   * because in the `updateRemoteSettings` function, Discord uses `this` to reference
   * itself and call the `updateLocalSettings` function
   */
  const updateRemoteSettings = getModule('updateRemoteSettings');
  const { updateLocalSettings } = getModule('updateLocalSettings');

  // Error handling
  const fix = `Use 'Discord:settings:getSettingInfo()' to see appropriate options.`;

  if (!setting || typeof setting !== 'string' || (!settings[setting] && !moreSettings[setting])) {
    return warn(MODULE, SUBMODULE, null, `You must enter a valid setting name of type string. ${fix}`);
  }

  if (!value) {
    return warn(MODULE, SUBMODULE, null, `You must enter a valid value for '${setting}'. ${fix}`);
  }

  if (sync === true) {
    return updateRemoteSettings.updateRemoteSettings({ [setting]: value });
  }

  return updateLocalSettings({ [setting]: value });
};

module.exports = setSetting;
