import React, { memo, useState, useEffect } from 'react';

import { WaveDivider } from '@vizality/components/misc';
import { Button, Icon } from '@vizality/components';
import { getModule } from '@vizality/webpack';
import { Guild } from '@vizality/constants';

export default memo(() => {
  const [ hasJoinedDiscord, setHasJoined ] = useState();
  const { getCurrentUser } = getModule('getCurrentUser');
  const { username } = getCurrentUser();
  const guilds = getModule('getGuild', 'getGuilds').getGuilds();

  useEffect(() => {
    setHasJoined(Boolean(Object.keys(guilds).find(guild => guild === Guild.ID)));
  }, [ hasJoinedDiscord ]);

  return (
    <div className='vz-dashboard-home-cta'>
      <div className='vz-dashboard-home-cta-overlay-background'>
        <div className='vz-dashboard-home-cta-background' />
      </div>
      <div className='vz-dashboard-home-cta-content'>
        <Icon className='vz-dashboard-home-cta-content-icon-wrapper' iconClassName='vz-dashboard-home-cta-content-icon' name='Vizality' width='100%' height='100%' />
        <div className='vz-dashboard-home-cta-content-header-wrapper'>
          <h1 className='vz-dashboard-home-cta-content-header'>Welcome, {username}!</h1>
          <h3 className='vz-dashboard-home-cta-content-subtext'>
            You've made the right choice. The power of customization is now at your fingertips. Check out the features below to learn how to harness your newfound power.
            {!hasJoinedDiscord && ` Make sure you check out the Discord server, we'd love to have you!`}
          </h3>
          {!hasJoinedDiscord && <div className='vz-dashboard-home-cta-content-buttons-wrapper'>
            <Button
              className='vz-dashboard-home-cta-content-button'
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
      <Icon
        className='vz-dashboard-home-cta-icon-wrapper'
        name='PersonWaving'
        size='100%'
      />
      <WaveDivider />
    </div>
  );
});
