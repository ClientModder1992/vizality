const { Card, Tooltip, Button, Clickable, Divider, Icon, Switch } = require('@components');
const { getModule } = require('@webpack');
const { Messages } = require('@i18n');
const { React } = require('@react');

const Permissions = require('./Permissions');
const Details = require('./Details');

module.exports = React.memo(({ product, isEnabled, onToggle, onUninstall, goToSettings }) => {
  const renderHeader = () => {
    return (
      <div className='vizality-entity-header'>
        <h4>{product.name}</h4>
        <Tooltip text={isEnabled ? Messages.DISABLE : Messages.ENABLE} position='top'>
          <div>
            <Switch value={isEnabled} onChange={v => onToggle(v.target.checked)} />
          </div>
        </Tooltip>
      </div>
    );
  };

  const renderDetails = () => {
    return (
      <>
        <Divider />
        <Details
          svgSize={24}
          author={product.author}
          version={product.version}
          description={product.description}
          license={product.license}
        />
      </>
    );
  };

  const renderPermissions = () => {
    const hasPermissions = product.permissions && product.permissions.length > 0;

    if (!hasPermissions) return null;

    return (
      <>
        <Divider />
        <Permissions svgSize={22} permissions={product.permissions} />
      </>
    );
  };

  // @todo: Consider making this an @discord utility function
  const goToDiscord = (code) => {
    const inviteStore = getModule('acceptInviteAndTransitionToInviteChannel');
    inviteStore.acceptInviteAndTransitionToInviteChannel(code);
    getModule('popLayer').popAllLayers();
  };

  const renderFooter = () => {
    if (!product.discord && typeof goToSettings !== 'function' && typeof onUninstall !== 'function') {
      return null;
    }

    return (
      <>
        <Divider/>
        <div className='vizality-entity-footer'>
          {product.discord && // @todo: i18n
          <Tooltip text='Go to their Discord support server'>
            <Clickable onClick={() => goToDiscord(product.discord)}>
              <Icon name='Discord' />
            </Clickable>
          </Tooltip>}
          {typeof goToSettings === 'function' && // @todo: i18n
          <Tooltip text='Settings'>
            <Clickable onClick={() => goToSettings()}>
              <Icon name='Gear' />
            </Clickable>
          </Tooltip>}
          <div className='buttons'>
            {typeof onUninstall === 'function' &&
            <Button
              onClick={() => onUninstall()}
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
  };

  return (
    <Card className='vizality-entity'>
      {renderHeader()}
      {renderDetails()}
      {renderPermissions()}
      {renderFooter()}
    </Card>
  );
});
