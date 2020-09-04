const { Clickable, Tooltip, Badge } = require('@components');
const { joinClassNames } = require('@utilities');
const { getModule } = require('@webpack');
const { Messages } = require('@i18n');
const { React } = require('@react');

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
