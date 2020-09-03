const { React, getModuleByDisplayName, getModule, i18n } = require('@webpack');
const { react : { findInReactTree } } = require('@utilities');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');

module.exports = class ChannelTitlebar extends Plugin {
  constructor () {
    super();
    this.guildHeader = null;
    this.activityPre = null;
    this.activity = null;
    this.activitySong = null;
    this.activityArtist = null;
  }

  onStart () {
    this.injectStyles('styles/main.scss');
    this._getGuildChannelHeader();
    this._injectImprovedChannelHeader();
  }

  onStop () {
    unpatch('pc-impChannelTitlebar-guildChannelHeader');
    unpatch('pc-impChannelTitlebar-channelHeader');
  }

  _getGuildChannelHeader () {
    const GuildHeader = getModuleByDisplayName('GuildHeader');

    patch('pc-impChannelTitlebar-guildChannelHeader', GuildHeader.prototype, 'renderHeader', (_, res) => {
      this.guildHeader = res;

      return res;
    });
  }

  async _injectImprovedChannelHeader () {
    const ChannelHeader = getModuleByDisplayName('HeaderBarContainer');

    patch('pc-impChannelTitlebar-channelHeader', ChannelHeader.prototype, 'render', (_, res) => {
      const found = findInReactTree(res, n => n.channel);

      if (!found) {
        return res;
      }

      let icon,
        iconId,
        iconType,
        noIconURL,
        activity,
        userActivity;

      // @todo: Fix this to check for status updates every 10 seconds or something

      // Guild channel
      if (found.channel.type === 0) {
        iconId = found.guild.id;
        ({ icon } = found.guild);
        iconType = 'icons';
        noIconURL = 'https://i.imgur.com/Fa13xn9.png';
      // User DM channel
      } else if (found.channel.type === 1) {
        iconId = found.channel.rawRecipients[0].id;
        icon = found.channel.rawRecipients[0].avatar;
        iconType = 'avatars';
        noIconURL = document.querySelector('.channel-2QD9_O.selected-aXhQR6 .avatar-VxgULZ') ? document.querySelector('.channel-2QD9_O.selected-aXhQR6 .avatar-VxgULZ').src : '';

        activity = getModule('getPrimaryActivity').getPrimaryActivity(iconId);

        if (activity) {
          if (activity.type === 0) {
            this.activityPre = 'Playing';
            this.activity = activity.name;
          } else if (activity.type === 1) {
            this.activityPre = 'Streaming';
            this.activity = activity.details;
          } else if (activity.type === 2) {
            this.activityPre = i18n._proxyContext.messages.ACTIVITY_FEED_NOW_PLAYING_SPOTIFY.split(' ');
            this.activityPre.pop();
            this.activityPre = this.activityPre.join(' ');
            this.activitySong = activity.details;
            this.activityArtist = activity.state;
          } else if (activity.type === 3) {
            this.activityPre = 'Watching';
            this.activity = activity.name;
          } else if (activity.type === 4 && activity.state) {
            this.activityPre = null;
            this.activity = activity.state;
          } else {
            this.activityPre = null;
            this.activitySong = null;
            this.activityArtist = null;
            this.activity = null;
          }
        }
      // Group DM channel
      } else if (found.channel.type === 3) {
        iconId = found.channel.id;
        ({ icon } = found.channel);
        iconType = 'channel-icons';
        noIconURL = document.querySelector('.channel-2QD9_O.selected-aXhQR6 .avatar-VxgULZ') ? document.querySelector('.channel-2QD9_O.selected-aXhQR6 .avatar-VxgULZ').src : '';
      }

      const iconURL = icon
        ? `url('https://cdn.discordapp.com/${iconType}/${iconId}/${icon}.png')`
        : `url(${noIconURL})`;

      if (found.channel.type === 1 && activity) {
        if (activity.type === 2) {
          userActivity =
            React.createElement(
              'div', {
                className: 'vz-channel-sub-navigation-user-activity'
              },
              /*
               * React.createElement(
               *   'span', {
               *     className: 'vz-channel-sub-navigation-user-activity-icon',
               *     style: { backgroundImage: 'url(\'/assets/f0655521c19c08c4ea4e508044ec7d8c.png\')' }
               *   }
               * ),
               */
              React.createElement(
                'span', {
                  className: 'vz-channel-sub-navigation-user-activity-pretext',
                  children: this.activityPre
                }
              ),
              React.createElement(
                'span', {
                  className: 'vz-channel-sub-navigation-user-activity-song',
                  children: this.activitySong
                }
              ),
              React.createElement(
                'span', {
                  className: 'vz-channel-sub-navigation-user-activity-by',
                  children: 'by'
                }
              ),
              React.createElement(
                'span', {
                  className: 'vz-channel-sub-navigation-user-activity-artist',
                  children: this.activityArtist
                }
              )
            );
        } else {
          userActivity =
            React.createElement(
              'div', {
                className: 'vz-channel-sub-navigation-user-activity'
              },
              /*
               * activity.type === 0 && activity.application_id && activity.assets && activity.assets.small_image
               *   ? React.createElement(
               *     'span', {
               *       className: 'vz-channel-sub-navigation-user-activity-icon',
               *       style: { backgroundImage: `url('https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png')` }
               *     }
               *   )
               *   : '',
               */
              this.activityPre
                ? React.createElement(
                  'span', {
                    className: 'vz-channel-sub-navigation-user-activity-pretext',
                    children: this.activityPre
                  }
                )
                : '',
              React.createElement(
                'span', {
                  className: 'vz-channel-sub-navigation-user-activity-text',
                  children: this.activity
                }
              )
            );
        }
      }

      const children = [
        React.createElement(
          'div', {
            className: 'vz-channel-sub-navigation-icon',
            style: {
              backgroundImage: iconURL
            }
          }
        ),
        React.createElement(
          'div', {
            className: 'vz-channel-sub-navigation'
          },
          found.channel.type === 0 ? this.guildHeader : '',
          res.props.children,
          userActivity ? userActivity : ''
        )
      ];

      res.props.children = children;

      return res;
    });
  }
};
