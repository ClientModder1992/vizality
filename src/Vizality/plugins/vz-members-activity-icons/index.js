const { Plugin } = require('vizality/entities');
const { inject, uninject } = require('vizality/injector');
const { React, getModuleByDisplayName } = require('vizality/webpack');
const { joinClassNames } = require('vizality/util');
const { Tooltip } = require('vizality/components');

module.exports = class MembersActivityIcons extends Plugin {
  startPlugin () {
    this.loadStylesheet('style.scss');

    this._injectActivityIcons();
  }

  async _injectActivityIcons () {
    const MemberListItem = await getModuleByDisplayName('MemberListItem');
    inject('vz-members-activity-icons', MemberListItem.prototype, 'render', (originalArgs, returnValue) => {
      const { activities } = returnValue.props.subText.props;

      if (!activities) return returnValue;

      for (const activity of activities) {
        if (activity.application_id && activity.assets && activity.assets.small_image) {
          returnValue.props.children =
            React.createElement(Tooltip, {
              text: activity.name,
              position: 'left'
            }, React.createElement(
              'div', {
                className: 'vizality-members-activity-icon',
                style: { backgroundImage: `url(https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png)` }
              }
            ));

          returnValue.props.className = joinClassNames(returnValue.props.className, 'vz-hasActivityIcon');

          return returnValue;
        }

        if (activity.type && activity.type === 2) {
          returnValue.props.children =
            React.createElement(Tooltip, {
              text: 'Spotify',
              position: 'left'
            }, React.createElement(
              'div', {
                className: 'vizality-members-activity-icon',
                style: { backgroundImage: 'url(\'/assets/f0655521c19c08c4ea4e508044ec7d8c.png\')' }
              }
            ));

          returnValue.props.className = joinClassNames(returnValue.props.className, 'vz-hasActivityIcon');

          return returnValue;
        }
      }

      return returnValue;
    });
  }

  pluginWillUnload () {
    uninject('vz-members-activity-icons');
  }
};
