const { getModule } = require('@vizality/webpack');

const getSections = () => {
  const { UserSettingsSections } = getModule('UserSettingsSections');

  const discordSections = Object.values(UserSettingsSections);
  const vizalitySections = Object.keys(vizality.api.settings.tabs);

  const sections = [ ...discordSections, ...vizalitySections ];

  return sections;
};

module.exports = getSections;
