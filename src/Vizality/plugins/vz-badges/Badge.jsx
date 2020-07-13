const { React, getModule, i18n: { Messages } } = require('vizality/webpack');
const { Clickable, Tooltip, Badge } = require('vizality/components');
const { joinClassNames } = require('vizality/util');

module.exports = ({ badge, onClick, location }) => {
  this.badgeWrapperClass = {};
  this.badgeClass = {};

  switch (location) {
    case 'profile': {
      const { profileBadgeWrapper } = getModule('profileBadgeWrapper');
      const { profileBadge } = getModule('profileBadge');

      this.badgeWrapperClass = profileBadgeWrapper;
      this.badgeClass = profileBadge;
      break;
    }
    case 'members': {
      const { icon } = getModule('ownerIcon', 'premiumIcon');

      this.badgeClass = icon;
      break;
    }
    default:
      return false;
  }

  return (
    <div className={joinClassNames('vizality-badge-wrapper', this.badgeWrapperClass)}>
      <Tooltip text={Messages[`VIZALITY_BADGES_${badge.toUpperCase()}`]} position='top'>
        <Clickable onClick={onClick}>
          <Badge className={this.badgeClass} type={badge} />
        </Clickable>
      </Tooltip>
    </div>
  );
};
