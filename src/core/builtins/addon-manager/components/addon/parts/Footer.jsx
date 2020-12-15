const { React, React: { useReducer } } = require('@vizality/react');
const { Icon, Switch, Button } = require('@vizality/components');
const { string: { toPlural } } = require('@vizality/util');
const { Messages } = require('@vizality/i18n');

module.exports = React.memo(props => {
  const { onUninstall, isEnabled, onToggle, type, addonId } = props;
  const [ , forceUpdate ] = useReducer(x => x + 1, 0);

  const isInstalled = vizality.manager[toPlural(type)].isInstalled(addonId);
  const hasSettings = vizality.api.settings.tabs[addonId];

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
          {/* <div className='vz-addon-card-tags'>
            <div className='vz-addon-card-tag'>
              Pie
            </div>
            <div className='vz-addon-card-tag'>
              Lazer Beams
            </div>
            <div className='vz-addon-card-tag'>
              Stuff
            </div>
          </div> */}
        </div>
        <div className='vz-addon-card-footer-section-right'>
          {isInstalled && hasSettings &&
            <div className='vz-addon-card-settings'>
              <Icon
                wrapperClassName='vz-addon-card-settings-button-wrapper'
                className='vz-addon-card-settings-button'
                name='Gear'
                tooltip='Settings'
                onClick={() => vizality.api.router.navigate(`/vizality/dashboard/${toPlural(type)}/${addonId}`)}
              />
            </div>
          }
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
