const { settings: { ButtonItem } } = require('@components');
const { getModule } = require('@webpack');
const { React } = require('@react');

module.exports = class ForceUI extends React.PureComponent {
  render () {
    return (
      <div id='force-ui' className='category'>
        <h2>Force UI</h2>
        <p>
          Some elements are painful to theme, either because they are locked to specific cases or are simply features you
          cannot always access (e.g. Verified perks, Nitro, etc.). By using this tool, you can trick Discord's UI and forcefully
          show those elements to your heart's desire.
        </p>
        {this.renderForceMentionEveryone()}
      </div>
    );
  }

  renderForceMentionEveryone () {
    // @todo: Disable when not applicable
    return (
      <ButtonItem
        note={'In large servers, trying to ping everyone will show a warning asking you if you\'re sure you want to perform this action.'}
        button='Display in Client'
        onClick={() => this.forceMentionEveryone()}
      >
          @everyone ping warning
      </ButtonItem>
    );
  }

  // Handlers
  forceMentionEveryone () {
    const { applyChatRestrictions } = getModule('applyChatRestrictions');
    const everyoneMdl = getModule('extractEveryoneRole');
    const ogExtractEveryoneRole = everyoneMdl.extractEveryoneRole;
    const ogShouldShowEveryoneGuard = everyoneMdl.shouldShowEveryoneGuard;
    const discordTextarea = document.querySelector('form > div > div');
    const fakeChannel = {
      id: 'yes',
      permissionOverwrites: {},
      getGuildId: () => 'yes'
    };
    everyoneMdl.extractEveryoneRole = () => '@everyone';
    everyoneMdl.shouldShowEveryoneGuard = () => true;
    applyChatRestrictions(discordTextarea, 'normal', 'yes', fakeChannel, true);
    everyoneMdl.extractEveryoneRole = ogExtractEveryoneRole;
    everyoneMdl.shouldShowEveryoneGuard = ogShouldShowEveryoneGuard;
  }
};

/*
 * Upload modal
 * Call modal
 * Search popup
 * Different Nitro states
 * Nitro boost plans
 * Verified server tabs
 * Twitch & YouTube integration settings
 * Offline & Login screens
 * Typing indicator
 */
