const { React, i18n: { Messages } } = require('powercord/webpack');
const { Tooltip, Switch, Icons: { Atom, Extension } } = require('powercord/components');

// @todo: merge with Product/
module.exports = ({ id, name, author, icon, version, enabled, onDisable, onEnable }) =>
  <div className='powercord-plugin-header'>
    <div className='powercord-plugin-icon' style={{
      backgroundImage: icon && `url(${icon})`
    }}>
      {!icon && <Extension/>}
    </div>
    <div className='powercord-plugin-header-inner'>
      <div className='name-version-container'>
        {id.startsWith('pc-') && <Tooltip text={'Core Extension'} position='top'>
          <div class='powercord-plugin-core-icon'>
            <Atom/>
          </div>
        </Tooltip>}
        <h4 className='name'>{name}</h4>
        <Tooltip text={Messages.POWERCORD_PLUGINS_VERSION} position='top'>
          <span className='version'>{version}</span>
        </Tooltip>
      </div>
      <div className='author'>
        <Tooltip text={Messages.APPLICATION_STORE_DETAILS_DEVELOPER} position='top'>
          <span>{author}</span>
        </Tooltip>
      </div>
    </div>
    <div>
      <Switch value={enabled} onChange={enabled ? onDisable : onEnable}/>
    </div>
  </div>;
