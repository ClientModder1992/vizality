const { Plugin } = require('@entities');
const { patch, unpatch } = require('@patcher');
const { React, getModule, getModuleByDisplayName, FluxDispatcher, i18n: { Messages } } = require('@webpack');
const { Tooltip, Icon, CustomIcons: { Plugin: PluginIcon, Theme: ThemeIcon } } = require('@components');
const { GUILD: { CHANNEL: { PLUGINS_CHANNEL, THEMES_CHANNEL } } } = require('@constants');
const { dom: { waitForElement }, react: { getOwnerInstance, forceUpdateElement } } = require('@utilities');

const Sidebar = require('./components/parts/sidebar/Sidebar');
const Routes = require('./routes/Routes');

module.exports = class Dashboard extends Plugin {
  onStart () {
    this.injectStyles('styles/main.scss');
    this.injectGuildsButton();
    this.injectChannels();

    vizality.api.router.registerRoute({
      path: '/dashboard',
      render: Routes,
      sidebar: Sidebar
    });
  }

  onStop () {
    vizality.api.router.unregisterRoute('/dashboard');
    unpatch('vz-dashboard-channels-props');
    unpatch('vz-dashboard-guilds-button');

    const classes = getModule('containerDefault');
    if (classes) forceUpdateElement(`.${classes.containerDefault}`, true);
  }

  injectChannels () {
    // (getModule(m => m.id && typeof m.keys === 'function' && m.keys().includes('./Activity')))('./Activity').default;
    const { transitionTo } = getModule('transitionTo');
    const ChannelItem = getModuleByDisplayName('ChannelItem');
    patch('vz-dashboard-channels-props', ChannelItem.prototype, 'render', function (_, res) {
      const data = {
        [PLUGINS_CHANNEL]: {
          icon: PluginIcon,
          name: Messages.VIZALITY_ENTITIES.format({ entityType: 'Plugin' }),
          route: '/_vizality/dashboard/plugins'
        },
        [THEMES_CHANNEL]: {
          icon: ThemeIcon,
          name: Messages.VIZALITY_ENTITIES.format({ entityType: 'Theme' }),
          route: '/_vizality/dashboard/themes'
        }
      };

      if (this.props.channel.id === PLUGINS_CHANNEL || this.props.channel.id === THEMES_CHANNEL) {
        res.props.children[1].props.children[0].props.children[1].props.children = data[this.props.channel.id].name;
        res.props.children[1].props.children[0].props.children[0] = React.createElement(data[this.props.channel.id].icon, {
          className: res.props.children[1].props.children[0].props.children[0].props.className,
          width: 24,
          height: 24
        });
        res.props.children[1].props.children[0].props.onClick = () => {
          transitionTo(data[this.props.channel.id].route);
          FluxDispatcher.dispatch({
            type: 'CHANNEL_SELECT',
            guildId: null
          });
        };
      }
      return res;
    });

    const { containerDefault } = getModule('containerDefault');
    forceUpdateElement(`.${containerDefault}`, true);
  }

  async injectGuildsButton () {
    const { listItemTooltip } = getModule('listItemTooltip');
    const guildClasses = getModule('tutorialContainer');
    const guildElement = (await waitForElement(`.${guildClasses.tutorialContainer.split(' ')[0]}`)).parentElement;
    const instance = getOwnerInstance(guildElement);
    patch('vz-dashboard-guilds-button', instance.__proto__, 'render', (_, res) => {
      const VizalityGuildButton = React.createElement('div', {
        class: 'listItem-2P_4kh vizality-dashboard-guild-button',
        onClick: async () => vizality.api.router.go('/dashboard')
      }, React.createElement(Tooltip, {
        text: 'Vizality Dashboard',
        position: 'right',
        tooltipClassName: listItemTooltip
      }, React.createElement('div', {
        className: 'pill-31IEus wrapper-sa6paO'
      }, React.createElement('span', {
        className: 'item-2hkk8m'
      })), React.createElement('div', {
        className: 'vizality-dashboard-guild-icon-wrapper'
      }, React.createElement(Icon, {
        class: 'vizality-dashboard-guild-icon',
        name: 'Vizality',
        width: '30px',
        height: '30px'
      }))));

      res.props.children[1].props.children.splice(1, 0, VizalityGuildButton);

      return res;
    });

    setImmediate(() => forceUpdateElement(`.${guildElement.className.split(' ')[0]}`, true));
  }
};
