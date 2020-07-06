/* eslint-disable prefer-const */

const { getModule } = require('vizality/webpack');
const { logger: { warn } } = require('vizality/util');

const setSetting = async (setting, value, sync = true) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Discord:settings:setSetting';

  const settings = getModule([ 'renderEmbeds', 'renderReactions', 'renderSpoilers' ]);
  const moreSettings = getModule([ 'darkSidebar', 'fontScale', 'fontSize' ]);

  // Error handling
  if (!setting) return warn(MODULE, SUBMODULE, null, `You must enter a setting. Use 'Discord:settings:getSettingInfo()' to see appropriate options.`);
  if (!value) return warn(MODULE, SUBMODULE, null, `You must enter a value for '${setting}'. Use 'Discord:settings:getSettingInfo' to see appropriate options.`);
  if (!settings[setting] && !moreSettings[setting]) {
    return warn(MODULE, SUBMODULE, null, `'${setting}' is not a valid setting. Use 'Discord:settings:getSettingInfo' to see appropriate options.`);
  }

  if (sync === true) return getModule([ 'updateRemoteSettings' ]).updateRemoteSettings({ [setting]: value }) || console.log('cheese');

  return getModule([ 'updateLocalSettings' ]).updateLocalSettings({ [setting]: value }) || console.log('cheese');
};

module.exports = setSetting;
