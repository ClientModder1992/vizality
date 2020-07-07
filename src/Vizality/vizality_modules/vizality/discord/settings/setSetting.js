/* eslint-disable prefer-const */

const { getModule } = require('vizality/webpack');
const { logger: { warn } } = require('vizality/util');

const setSetting = async (setting, value, sync = true) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Discord:settings:setSetting';

  const settings = getModule('renderEmbeds', 'renderReactions', 'renderSpoilers');
  const moreSettings = getModule('darkSidebar', 'fontScale', 'fontSize');

  const updateRemoteSettings = getModule('updateRemoteSettings');
  const updateLocalSettings = getModule('updateLocalSettings');

  // Error handling
  if (!setting) return warn(MODULE, SUBMODULE, null, `You must enter a setting. Use 'Discord:settings:getSettingInfo()' to see appropriate options.`);
  if (!value) return warn(MODULE, SUBMODULE, null, `You must enter a value for '${setting}'. Use 'Discord:settings:getSettingInfo' to see appropriate options.`);
  if (!settings[setting] && !moreSettings[setting]) {
    return warn(MODULE, SUBMODULE, null, `'${setting}' is not a valid setting. Use 'Discord:settings:getSettingInfo' to see appropriate options.`);
  }

  if (sync === true) return updateRemoteSettings.updateRemoteSettings({ [setting]: value }) || console.log('cheese');

  return updateLocalSettings.updateLocalSettings({ [setting]: value }) || console.log('cheese');
};

module.exports = setSetting;
