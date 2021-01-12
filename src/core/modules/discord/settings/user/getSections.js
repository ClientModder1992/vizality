const { getModule } = require('@vizality/webpack');

const getSections = () => {
  const { UserSettingsSections } = getModule('UserSettingsSections');

  const discordSections = Object.values(UserSettingsSections);

  const sections = [ ...discordSections ];

  return sections;
};

module.exports = getSections;
