const { getModuleByDisplayName } = require('@webpack');
const { AsyncComponent } = require('@components');
const { React } = require('@react');

const DiscordExperiments = AsyncComponent.from(getModuleByDisplayName('UserSettingsExperiments'));

module.exports = React.memo(() => {
  return (
    <DiscordExperiments />
  );
});
