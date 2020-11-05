const { getModuleByDisplayName } = require('@vizality/webpack');
const { React } = require('@vizality/react');

const DiscordExperiments = getModuleByDisplayName('UserSettingsExperiments');

module.exports = React.memo(() => {
  return (
    <DiscordExperiments />
  );
});
