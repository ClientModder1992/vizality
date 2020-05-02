const { React, get } = require('powercord/webpack');
const { Button, Spinner } = require('powercord/components');
const { sleep } = require('powercord/util');
const { shell: { openExternal } } = require('electron');
const { Tooltip, Icons: { Reload, GitHubAlt, Globe, Folder } } = require('powercord/components');

// @todo: merge with Product/
module.exports = ({ id, source, website, installing, onUninstall, enabled }) =>
  <div className='powercord-plugin-footer'>
    {(source || website) && <div className='btn-group misc'>
      {source && <Tooltip text={'Source'} position='top'>
        <Button
          onClick={() => openExternal(source)}
          look={Button.Looks.LINK}
          size={Button.Sizes.ICON}
          color={Button.Colors.TRANSPARENT}
        >
          <GitHubAlt
            style={{ height: 21 }}
          />
        </Button>
      </Tooltip>}
      {website && <Tooltip text={'Website'} position='top'>
        <Button
          onClick={() => openExternal(website)}
          look={Button.Looks.LINK}
          size={Button.Sizes.ICON}
          color={Button.Colors.TRANSPARENT}
        >
          <Globe/>
        </Button>
      </Tooltip>}
      <Tooltip text={'Open in Folder'} position='top'>
        <Button
          onClick={() => console.log('cheese')}
          look={Button.Looks.LINK}
          size={Button.Sizes.ICON}
          color={Button.Colors.TRANSPARENT}
        >
          <Folder/>
        </Button>
      </Tooltip>
    </div>}
    {/* powercord.pluginManager.remount(id) */}
    <div className='btn-group'>
      {enabled && <Tooltip text={'Reload'} position='top'>
        <Button
          onClick={async (e) => {
            const element = e.target.closest('button');
            element.classList.add('reloading');
            setImmediate(() => powercord.pluginManager.remount(id));
            await sleep(1000);
            element.classList.remove('reloading');
          }}
          color={Button.Colors.TRANSPARENT}
          look={Button.Looks.LINK}
          size={Button.Sizes.ICON}
        >
          <Reload/>
        </Button>
      </Tooltip>}
      {!id.startsWith('pc-') && <Button
        disabled={installing}
        onClick={onUninstall}
        color={Button.Colors.RED}
        look={Button.Looks.SOLID}
        size={Button.Sizes.SMALL}
      >
        {installing
          ? <Spinner type='pulsingEllipsis'/>
          : 'Uninstall'
        }
      </Button>}
      {/* You could also use !!powercord.pluginManager.plugins.get(id).registered.settings.length */}
      {powercord.api.settings.tabs.find(tab => tab.section.includes(id)) && <Button
        disabled={installing}
        onClick={() => {
          get('setSection', 'open', 'updateAccount')(id);
        }}
        color={Button.Colors.GREEN}
        look={Button.Looks.SOLID}
        size={Button.Sizes.SMALL}
      >
        Settings
      </Button>}
    </div>
  </div>;
