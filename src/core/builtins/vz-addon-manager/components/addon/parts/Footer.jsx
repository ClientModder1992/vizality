import React, { memo, useReducer } from 'react';

import { Icon, Switch, Button } from '@vizality/components';
import { toPlural } from '@vizality/util/string';
import { Messages } from '@vizality/i18n';

export default memo(props => {
  const { onUninstall, isEnabled, onToggle, type, addonId } = props;
  const [ , forceUpdate ] = useReducer(x => x + 1, 0);

  const isInstalled = vizality.manager[toPlural(type)].isInstalled(addonId);
  const hasSettings = vizality.manager[toPlural(type)].hasSettings(addonId);

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
            <div className='vz-addon-card-settings-button'>
              <Icon
                className='vz-addon-card-settings-button-icon-wrapper'
                iconClassName='vz-addon-card-settings-button-icon'
                name='Gear'
                tooltip='Settings'
                onClick={() => vizality.api.routes.navigateTo(`/vizality/${toPlural(type)}/${addonId}`)}
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
