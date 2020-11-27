const { dom: { waitForElement }, react: { forceUpdateElement, getOwnerInstance } } = require('@vizality/util');
const { getModule, getModules, getModuleByDisplayName } = require('@vizality/webpack');
const { Clickable, Tooltip } = require('@vizality/components');
const { patch, unpatch } = require('@vizality/patcher');
const { Builtin } = require('@vizality/entities');
const { HTTP } = require('@vizality/constants');
const { React } = require('@vizality/react');
const { get } = require('@vizality/http');

const { open: openModal } = require('@vizality/modal');

const DonateModal = require('./DonateModal');
const BadgesComponent = require('./Badges');

module.exports = class Badges extends Builtin {
  constructor () {
    super();
    this.guildBadges = {};
  }

  onStart () {
    return void 0;
    this.classes = {
      ...getModule('headerInfo', 'nameTag'),
      ...getModules([ 'modal', 'inner' ])[1],
      header: getModule('iconBackgroundTierNone', 'container').header
    };

    Object.keys(this.classes).forEach(
      key => this.classes[key] = `.${this.classes[key].split(' ')[0]}`
    );

    this.injectStyles('styles/main.scss');
    this._patchGuildTooltips();
    this._patchGuildHeaders();
    this._patchUserComponent();
    this._fetchBadges();
  }

  onStop () {
    unpatch('vz-badges-users');
    unpatch('vz-badges-guilds-header');
    unpatch('vz-badges-guilds-tooltip');

    forceUpdateElement(this.classes.header);
  }

  async _patchGuildTooltips () {
    const _this = this;
    const GuildBadge = getModuleByDisplayName('GuildBadge');
    patch('vz-badges-guilds-tooltip', GuildBadge.prototype, 'render', function (_, res) {
      const { guild } = this.props;
      // GuildBadges is used in different places, size prop seems GuildTooltip "exclusive"
      if (this.props.size && _this.guildBadges[guild.id]) {
        return [ _this._renderBadge(_this.guildBadges[guild.id]), res ];
      }

      return res;
    });
  }

  async _patchGuildHeaders () {
    const _this = this;
    const GuildHeader = getModuleByDisplayName('GuildHeader');
    patch('vz-badges-guilds-header', GuildHeader.prototype, 'renderHeader', function (_, res) {
      if (_this.guildBadges[this.props.guild.id]) {
        res.props.children.unshift(
          _this._renderBadge(_this.guildBadges[this.props.guild.id])
        );
      }
      return res;
    });
  }

  async _patchUserComponent () {
    const { classes } = this;
    const instance = getOwnerInstance((await waitForElement([
      classes.modal, classes.headerInfo, classes.nameTag
    ].join(' '))).parentElement);

    const UserProfileBody = instance._reactInternals.return.type;
    patch('vz-badges-users', UserProfileBody.prototype, 'renderBadges', function (_, res) {
      const badges = React.createElement(BadgesComponent, {
        key: 'vizality',
        id: this.props.user.id
      });

      if (!res) {
        return React.createElement('div', { className: 'vizality-badges' }, badges);
      }

      res.props.children.push(badges);
      return res;
    });
    instance.forceUpdate();
  }

  async _fetchBadges () {
    try {
      this.guildBadges = await get(`${HTTP.API}/guilds/badges`).then(res => res.body);

      if (document.querySelector(this.classes.header)) {
        forceUpdateElement(this.classes.header);
      }
    } catch (err) {
      // Let it fail silently
    }
  }

  _renderBadge ({ name, icon }) {
    return React.createElement(Tooltip, {
      text: name,
      position: 'bottom'
    }, React.createElement(Clickable, {
      onClick: () => openModal(DonateModal),
      className: 'vizality-guild-badge'
    }, React.createElement('img', {
      src: icon,
      alt: ''
    })));
  }
};
