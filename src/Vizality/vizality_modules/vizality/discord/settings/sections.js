const { getModule } = require('vizality/webpack');

const discordSections = {
  ...Object.values(getModule([ 'UserSettingsSections' ], false).UserSettingsSections)
};

const vizalitySections = {
  ...Object.keys(vizality.api.settings.tabs)
};

const sectionsObject = {
  ...vizalitySections,
  ...discordSections
};

const sections = Object.values(sectionsObject);

module.exports = sections;
