const { getModuleByDisplayName } = require('@webpack');
const { React } = require('@react');

const DiscordExperiments = getModuleByDisplayName('UserSettingsExperiments');

module.exports = React.memo(() => {
  return (
    <DiscordExperiments />
  );
});
