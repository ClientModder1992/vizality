const { getModule } = require('vizality/webpack');

const _getSections = () => {
  const DISCORD_SECTIONS = Object.values(getModule([ 'UserSettingsSections' ], false).UserSettingsSections);
  const VIZALITY_SECTIONS = Object.keys(vizality.api.settings.tabs);
  const ALL_SECTIONS = DISCORD_SECTIONS.concat(VIZALITY_SECTIONS);

  return ALL_SECTIONS;
};

module.exports = _getSections;
