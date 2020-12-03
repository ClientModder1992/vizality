const { React, React: { useReducer } } = require('@vizality/react');
const { Icon, Switch, Button } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');

module.exports = React.memo(props => {
  const { onUninstall, isEnabled, onToggle } = props;
  const [ , forceUpdate ] = useReducer(x => x + 1, 0);

  return (
    <div className='vz-addon-card-footer-wrapper'>
      <div className='vz-addon-card-footer'>
        <div className='vz-addon-card-footer-section-left'>
          {onUninstall &&
            <div className='vz-addon-card-uninstall'>
              <Button
                onClick={e => {
                  e.stopPropagation();
                  onUninstall();
                }}
                color={Button.Colors.RED}
                look={Button.Looks.FILLED}
                size={Button.Sizes.SMALL}
              >
                {Messages.APPLICATION_CONTEXT_MENU_UNINSTALL}
              </Button>
            </div>
          }
        </div>
        <div className='vz-addon-card-footer-section-right'>
          <div className='vz-addon-card-settings'>
            <Icon
              wrapperClassName='vz-addon-card-settings-button-wrapper'
              className='vz-addon-card-settings-button'
              name='Gear'
              tooltip='Settings'
              onClick={() => void 0}
            />
          </div>
          <div className='vz-addon-card-toggle-wrapper'>
            <Switch
              className='vz-addon-card-toggle'
              value={isEnabled}
              onChange={v => {
                onToggle(v.target.checked);
                forceUpdate();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
