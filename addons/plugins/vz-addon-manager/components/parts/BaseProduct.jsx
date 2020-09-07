const { Tooltip, Button, Clickable, Divider, Icon, Switch } = require('@components');
const { getModule } = require('@webpack');
const { Messages } = require('@i18n');
const { React } = require('@react');

const Permissions = require('./Permissions');
const Details = require('./Details');

module.exports = class BaseProduct extends React.PureComponent {
  renderHeader () {
    return (
      <div className='vizality-entity-header'>
        <h4>{this.props.product.name}</h4>
        <Tooltip text={this.props.isEnabled ? Messages.DISABLE : Messages.ENABLE} position='top'>
          <div>
            <Switch value={this.props.isEnabled} onChange={v => this.props.onToggle(v.target.checked)}/>
          </div>
        </Tooltip>
      </div>
    );
  }

  renderDetails () {
    return (
      <>
        <Divider/>
        <Details
          svgSize={24}
          author={this.props.product.author}
          version={this.props.product.version}
          description={this.props.product.description}
        />
      </>
    );
  }

  renderPermissions () {
    const hasPermissions = this.props.product.permissions && this.props.product.permissions.length > 0;

    if (!hasPermissions) return null;

    return (
      <>
        <Divider/>
        <Permissions svgSize={22} permissions={this.props.product.permissions}/>
      </>
    );
  }

  renderFooter () {
    if (!this.props.product.discord && typeof this.props.goToSettings !== 'function' && typeof this.props.onUninstall !== 'function') {
      return null;
    }

    return (
      <>
        <Divider/>
        <div className='vizality-entity-footer'>
          {this.props.product.discord && // @todo: i18n
          <Tooltip text='Go to their Discord support server'>
            <Clickable onClick={() => this.goToDiscord(this.props.product.discord)}>
              <Icon name='Discord' />
            </Clickable>
          </Tooltip>}
          {typeof this.props.goToSettings === 'function' && // @todo: i18n
          <Tooltip text='Settings'>
            <Clickable onClick={() => this.props.goToSettings()}>
              <Icon name='Gear' />
            </Clickable>
          </Tooltip>}
          <div className='buttons'>
            {typeof this.props.onUninstall === 'function' &&
            <Button
              onClick={() => this.onUninstall()}
              color={Button.Colors.RED}
              look={Button.Looks.FILLED}
              size={Button.Sizes.SMALL}
            >
              {Messages.APPLICATION_CONTEXT_MENU_UNINSTALL}
            </Button>}
          </div>
        </div>
      </>
    );
  }

  // @todo: Consider making this an @discord utility function
  goToDiscord (code) {
    const inviteStore = getModule('acceptInviteAndTransitionToInviteChannel');
    inviteStore.acceptInviteAndTransitionToInviteChannel(code);
    getModule('popLayer').popAllLayers();
  }
};
