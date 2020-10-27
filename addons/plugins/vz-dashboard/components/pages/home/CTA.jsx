const { Button, Icon, misc: { WaveDivider } } = require('@components');
const { React, React: { useState, useEffect } } = require('@react');
const { getModule } = require('@webpack');
const { Guild } = require('@constants');

module.exports = React.memo(() => {
  const [ hasJoinedDiscord, setHasJoined ] = useState();
  const { getCurrentUser } = getModule('getCurrentUser');
  const currentUserName = getCurrentUser().username;
  const guilds = getModule('getGuild', 'getGuilds').getGuilds();

  useEffect(() => {
    setHasJoined(Boolean(Object.keys(guilds).find(guild => guild === Guild.ID)));
  }, [ hasJoinedDiscord ]);

  return (
    <div className='vz-home-cta'>
      <div className='vz-home-cta-overlay-background'>
        <div className='vz-home-cta-background' />
      </div>
      <div className='vz-home-cta-content'>
        <Icon className='vz-home-cta-content-icon-wrapper' iconClassName='vz-home-cta-content-icon' name='Vizality' width='100%' height='100%' />
        <div className='vz-home-cta-content-header-wrapper'>
          <h1 className='vz-home-cta-content-header'>Welcome, {currentUserName}!</h1>
          <h3 className='vz-home-cta-content-subtext'>
            You've made the right choice. The power of customization is now at your fingertips. Check out the features below to learn how to harness your newfound power.
            {!hasJoinedDiscord && <>
              Make sure you check out the Discord server, we'd love to have you!
            </>}
          </h3>
          {!hasJoinedDiscord && <div className='vz-home-cta-content-buttons-wrapper'>
            <Button
              className='vz-home-cta-content-button'
              onClick={() => {
                const inviteStore = getModule('acceptInviteAndTransitionToInviteChannel');
                const pop = getModule('popLayer');
                inviteStore.acceptInviteAndTransitionToInviteChannel(Guild.INVITE);
                pop.popAllLayers();
              }}
              color={Button.Colors.WHITE}
              look={Button.Looks.FILLED}
              size={Button.Sizes.LARGE}
            >
              Join the Discord Server
            </Button>
          </div>}
        </div>
      </div>
      <Icon className='vz-home-cta-icon-wrapper' name='PersonWaving' width='100%' height='100%' />
      <WaveDivider color='var(--background-primary)' />
    </div>
  );
});
