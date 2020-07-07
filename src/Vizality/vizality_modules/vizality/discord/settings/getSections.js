const { getModule } = require('vizality/webpack');

const getSections = () => {
  const discordSections = Object.values(getModule('UserSettingsSections').UserSettingsSections);
  const vizalitySections = Object.keys(vizality.api.settings.tabs);
  const sections = discordSections.concat(vizalitySections);

  return sections;
};

module.exports = getSections;
