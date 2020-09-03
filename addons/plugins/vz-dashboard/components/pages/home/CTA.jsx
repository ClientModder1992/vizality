const { Button, Icon, SVG: { WaveDivider } } = require('@components');
const { React, getModule, React: { useState, useEffect } } = require('@webpack');
const { GUILD: { GUILD_ID, GUILD_INVITE } } = require('@constants');

module.exports = React.memo(() => {
  const [ hasJoinedDiscord, setHasJoined ] = useState();

  const { getCurrentUser } = getModule('getCurrentUser');
  const currentUserName = getCurrentUser().username;
  const guilds = getModule('getGuild', 'getGuilds').getGuilds();

  useEffect(() => {
    setHasJoined(Boolean(Object.keys(guilds).find(guild => guild === GUILD_ID)));
  }, [ hasJoinedDiscord ]);

  return (
    <div className='vizality-dashboard-page-home-cta'>
      <div className='vizality-dashboard-page-home-cta-overlay-background'>
        <div className='vizality-dashboard-page-home-cta-background' />
      </div>
      <div className='vizality-dashboard-page-home-cta-content'>
        <div className='vizality-dashboard-page-home-cta-content-icon-container'>
          <Icon name='Vizality' className='vizality-dashboard-page-home-cta-content-icon' width={'100%'} height={'100%'} />
        </div>
        <div className='vizality-dashboard-page-home-cta-content-header'>
          <h1 className='vizality-dashboard-page-home-cta-content-header-welcome'>Welcome, {currentUserName}!</h1>
          <h3 className='vizality-dashboard-page-home-cta-content-header-subtext'>
            <span>You've made the right choice. The power of customization is now at your fingertips. Check out the features below to learn to harness your newfound power.</span>
            {!hasJoinedDiscord && <span> Make sure you check out the Discord server, we'd love to have you!</span>}
          </h3>
          {!hasJoinedDiscord && <div className='vizality-dashboard-page-home-cta-content-buttons-wrapper'>
            <Button
              className='vizality-dashboard-page-home-cta-content-button'
              onClick={() => {
                const inviteStore = getModule('acceptInviteAndTransitionToInviteChannel');
                const pop = getModule('popLayer');
                inviteStore.acceptInviteAndTransitionToInviteChannel(GUILD_INVITE);
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
      <div className='bob'>
        <Icon name='PersonWaving' width={'100%'} height={'100%'} />
      </div>
      <WaveDivider color='var(--background-primary)' />
    </div>
  );
});
