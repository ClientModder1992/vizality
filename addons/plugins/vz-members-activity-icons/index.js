const { React, getModuleByDisplayName } = require('@webpack');
const { joinClassNames } = require('@utilities');
const { patch, unpatch } = require('@patcher');
const { Tooltip } = require('@components');
const { Plugin } = require('@entities');

class MembersActivityIcons extends Plugin {
  onStart () {
    this.injectStyles('style.scss');
    this._injectActivityIcons();
  }

  onStop () {
    unpatch('vz-members-activity-icons');
  }

  async _injectActivityIcons () {
    const MemberListItem = getModuleByDisplayName('MemberListItem');
    patch('vz-members-activity-icons', MemberListItem.prototype, 'render', (_, res) => {
      const { activities } = res.props.subText.props;

      if (!activities) return res;

      for (const activity of activities) {
        if (activity.application_id && activity.assets && activity.assets.small_image) {
          res.props.children =
            React.createElement(Tooltip, {
              text: activity.name,
              position: 'left'
            }, React.createElement(
              'div', {
                className: 'vizality-members-activity-icon',
                style: { backgroundImage: `url(https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png)` }
              }
            ));

          res.props.className = joinClassNames(res.props.className, 'vz-hasActivityIcon');

          return res;
        }

        if (activity.type && activity.type === 2) {
          res.props.children =
            React.createElement(Tooltip, {
              text: 'Spotify',
              position: 'left'
            }, React.createElement(
              'div', {
                className: 'vizality-members-activity-icon',
                style: { backgroundImage: 'url(\'/assets/f0655521c19c08c4ea4e508044ec7d8c.png\')' }
              }
            ));

          res.props.className = joinClassNames(res.props.className, 'vz-hasActivityIcon');

          return res;
        }
      }

      return res;
    });
  }
}

module.exports = MembersActivityIcons;
