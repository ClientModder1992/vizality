/* eslint-disable prefer-destructuring */
const { Plugin } = require('vizality/entities');
const { React, getModuleByDisplayName } = require('vizality/webpack');
const { inject, uninject } = require('vizality/injector');
const { Tooltip } = require('vizality/components');

module.exports = class ChannelMembersActivityIcons extends Plugin {
  startPlugin () {
    this.loadStylesheet('style.scss');

    this._injectActivityIcons();
  }

  async _injectActivityIcons () {
    const MemberListItem = await getModuleByDisplayName('MemberListItem');
    inject('channelMembersActivityIcons-members', MemberListItem.prototype, 'render', (_, res) => {
      if (!res ||
          !res.props ||
          !res.props.subText ||
          !res.props.subText.props ||
          !res.props.subText.props.activities.length
      ) {
        return res;
      }

      for (const activity of res.props.subText.props.activities) {
        if (activity.application_id &&
            activity.assets &&
            activity.assets.small_image
        ) {
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

          res.props.className += ' vz-hasActivityIcon';

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

          res.props.className += ' vz-hasActivityIcon';

          return res;
        }
      }

      return res;
    });
  }

  pluginWillUnload () {
    uninject('channelMembersActivityIcons-members');
  }
};
