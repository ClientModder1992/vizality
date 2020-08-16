const { GUILD: { GUILD_ID, GUILD_INVITE }, REPO: { I18N_REPO, VIZALITY_REPO }, CDN: { WEBSITE_CDN, API_CDN } } = require('@constants');
const { React, getModule, constants: { Routes } } = require('@webpack');
const { Clickable, Tooltip } = require('@components');
const { open: openModal } = require('vizality/modal');
const { get } = require('@http');

const { shell: { openExternal } } = require('electron');

const DonateModal = require('./DonateModal');
const Badge = require('./Badge');

const badgesStore = {};
const badges = {
  developer: () => openExternal(`${WEBSITE_CDN}/contributors`),
  staff: async () => {
    const store = getModule('getGuilds');
    if (store.getGuilds()[GUILD_ID]) {
      const router = getModule('transitionTo');
      const channel = getModule('getLastSelectedChannelId');
      const userProfileModal = getModule('fetchProfile');
      // eslint-disable-next-line new-cap
      router.transitionTo(Routes.CHANNEL(GUILD_ID, channel.getChannelId(GUILD_ID)));
      userProfileModal.close();
    } else {
      const windowManager = getModule('flashFrame', 'minimize');
      const { INVITE_BROWSER: { handler: popInvite } } = getModule('INVITE_BROWSER');
      const oldMinimize = windowManager.minimize;
      windowManager.minimize = () => void 0;
      popInvite({ args: { code: GUILD_INVITE } });
      windowManager.minimize = oldMinimize;
    }
  },
  contributor: () => openExternal(`${WEBSITE_CDN}/contributors`),
  translator: () => openExternal(I18N_REPO),
  hunter: () => openExternal(`https://github.com/${VIZALITY_REPO}/issues?q=label:bug`),
  early: () => void 0
};

class Badges extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = badgesStore[props.id] || {};
  }

  async componentDidMount () {
    // Fetch even if the store is populated, to update cached stuff
    try {
      const { badges } = await get(`${API_CDN}/badges/users/${this.props.id}.json`).then(res => res.body);
      this.setState(badges);
      badgesStore[this.props.id] = badges;
    } catch (err) {
      // Let it fail silently.
    }
  }

  render () {
    return [
      this.state.custom && this.state.custom.icon && this.state.custom.name &&
      <Tooltip text={this.state.custom.name} position='top'>
        <Clickable onClick={() => openModal(DonateModal)} className='vizality-badge donor' style={{
          '--custom': `url('${this.state.custom.icon}')`,
          '--custom-white': `url('${this.state.custom.white}')`,
          '--custom-name': `url('${this.state.custom.name}')`
        }}/>
      </Tooltip>,
      Object.keys(badges).map(badge => this.state[badge] && <Badge
        badge={badge} key={badge} location={'profile'} onClick={badges[badge]}
        color={this.state.custom && this.state.custom.color ? this.state.custom.color : '7289DA'}
      />)
    ];
  }
}

module.exports = Badges;
