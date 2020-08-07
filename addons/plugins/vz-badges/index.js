const { dom: { waitForElement }, react: { forceUpdateElement, getOwnerInstance } } = require('@utilities');
const { React, getModule, getAllModules, getModuleByDisplayName } = require('@webpack');
const { open: openModal } = require('vizality/modal');
const { Clickable, Tooltip } = require('@components');
const { patch, unpatch } = require('@patcher');
const { WEBSITE } = require('@constants');
const { Plugin } = require('@entities');
const { get } = require('@http');

const DonateModal = require('./DonateModal');
const BadgesComponent = require('./Badges');

class Badges extends Plugin {
  constructor () {
    super();
    this.guildBadges = {};
  }

  onStart () {
    this.classes = {
      ...getModule('headerInfo', 'nameTag'),
      ...getAllModules([ 'modal', 'inner' ])[1],
      header: getModule('iconBackgroundTierNone', 'container').header
    };

    Object.keys(this.classes).forEach(
      key => this.classes[key] = `.${this.classes[key].split(' ')[0]}`
    );

    this.loadStylesheet('style.scss');
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

    const UserProfileBody = instance._reactInternalFiber.return.type;
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
      this.guildBadges = await get(`${WEBSITE}/api/guilds/badges`).then(res => res.body);

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
}

module.exports = Badges;
