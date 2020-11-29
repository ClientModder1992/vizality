const { Icon, Tooltip, Switch, Button } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');
const { React, React: { useReducer } } = require('@vizality/react');

module.exports = React.memo(({ onUninstall, displayType, isEnabled, onToggle }) => {
  const [ , forceUpdate ] = useReducer(x => x + 1, 0);

  return (
    <>
      {displayType !== 'table' && <div className='vz-addon-card-footer-wrapper'>
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
                  {/* <Icon
                    wrapperClassName='vz-addon-card-uninstall-button-wrapper'
                    className='vz-addon-card-uninstall-button'
                    name='Trash'
                    tooltip='Uninstall'
                    onClick={e => {
                      e.stopPropagation();
                      onUninstall();
                    }}
                  /> */}
                </div>
            }
            {/* {displayType !== 'grid-small' && <>
              <div className='vz-addon-card-footer-rating-wrapper'>
                <Tooltip text='Rating'>
                  <Icon
                    className='vz-addon-card-rating-icon'
                    wrapperClassName='vz-addon-card-rating-icon-wrapper'
                    name='Star'
                    size='16'
                  />
                  <span className='vz-addon-card-footer-rating-number'>5</span>
                </Tooltip>
              </div>
              <div className='vz-addon-card-footer-downloads-wrapper'>
                <Tooltip text='Downloads'>
                  <Icon
                    className='vz-addon-card-downloads-icon'
                    wrapperClassName='vz-addon-card-downloads-icon-wrapper'
                    name='Download'
                    size='16'
                  />
                  <span className='vz-addon-card-footer-downloads-count'>16.2M</span>
                </Tooltip>
              </div>
              <div className='vz-addon-card-footer-last-updated-wrapper'>
                <Tooltip text='Latest Update'>
                  <Icon
                    className='vz-addon-card-last-updated-icon'
                    wrapperClassName='vz-addon-card-last-updated-icon-wrapper'
                    name='ClockReverse'
                    size='16'
                  />
                  <span className='vz-addon-card-footer-updated-date'>11/26/2020</span>
                </Tooltip>
              </div>
            </>} */}
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
      </div>}
    </>
  );
});
