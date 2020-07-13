const { get } = require('vizality/http');
const { Plugin } = require('vizality/entities');
const { WEBSITE } = require('vizality/constants');
const { open: openModal } = require('vizality/modal');
const { Clickable, Tooltip } = require('vizality/components');
const { inject, uninject } = require('vizality/injector');
const { React, getModule, getAllModules, getModuleByDisplayName } = require('vizality/webpack');
const { dom: { waitFor }, react: { forceUpdateElement, getOwnerInstance } } = require('vizality/util');

const DonateModal = require('./DonateModal');
const BadgesComponent = require('./Badges');

module.exports = class Badges extends Plugin {
  constructor () {
    super();
    this.guildBadges = {};
  }

  async startPlugin () {
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

  pluginWillUnload () {
    uninject('vz-badges-users');
    uninject('vz-badges-guilds-header');
    uninject('vz-badges-guilds-tooltip');

    forceUpdateElement(this.classes.header);
  }

  async _patchGuildTooltips () {
    const _this = this;
    const GuildBadge = getModuleByDisplayName('GuildBadge');
    inject('vz-badges-guilds-tooltip', GuildBadge.prototype, 'render', function (_, retValue) {
      const { guild } = this.props;
      // GuildBadges is used in different places, size prop seems GuildTooltip "exclusive"
      if (this.props.size && _this.guildBadges[guild.id]) {
        return [ _this._renderBadge(_this.guildBadges[guild.id]), retValue ];
      }

      return retValue;
    });
  }

  async _patchGuildHeaders () {
    const _this = this;
    const GuildHeader = getModuleByDisplayName('GuildHeader');
    inject('vz-badges-guilds-header', GuildHeader.prototype, 'renderHeader', function (_, retValue) {
      if (_this.guildBadges[this.props.guild.id]) {
        retValue.props.children.unshift(
          _this._renderBadge(_this.guildBadges[this.props.guild.id])
        );
      }
      return retValue;
    });
  }

  async _patchUserComponent () {
    const { classes } = this;
    const instance = getOwnerInstance((await waitFor([
      classes.modal, classes.headerInfo, classes.nameTag
    ].join(' '))).parentElement);

    const UserProfileBody = instance._reactInternalFiber.return.type;
    inject('vz-badges-users', UserProfileBody.prototype, 'renderBadges', function (_, retValue) {
      const badges = React.createElement(BadgesComponent, {
        key: 'vizality',
        id: this.props.user.id
      });

      if (!retValue) {
        return React.createElement('div', { className: 'vizality-badges' }, badges);
      }

      retValue.props.children.push(badges);
      return retValue;
    });
    instance.forceUpdate();
  }

  async _fetchBadges () {
    try {
      this.guildBadges = await get(`${WEBSITE}/api/guilds/badges`).then(res => res.body);

      if (document.querySelector(this.classes.header)) {
        forceUpdateElement(this.classes.header);
      }
    } catch (e) {
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
