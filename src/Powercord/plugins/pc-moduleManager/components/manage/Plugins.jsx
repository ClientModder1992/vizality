const { React, i18n: { Messages }, get } = require('powercord/webpack');
const { open: openModal, close: closeModal } = require('powercord/modal');
const { Tooltip, Card, Switch, Button, Divider, Spinner, Icons: { Bug, Extension, Reload, Folder, GitHubAlt, Globe, Trash, Gear } } = require('powercord/components');
const { Confirm } = require('powercord/components/modal');
const { sleep } = require('powercord/util');
const { shell, shell: { openExternal } } = require('electron');
const { join } = require('path');

const Permissions = require('../parts/Permissions');
const Details = require('../parts/Details');
const Base = require('./Base');

class Plugins extends Base {
  renderItem (item) {
    // You could also use !!powercord.pluginManager.plugins.get(id).registered.settings.length
    const hasSettings = powercord.api.settings.tabs.find(tab => tab.section.includes(item.entityID));
    const enabled = powercord.pluginManager.isEnabled(item.entityID);
    const hasPermissions = item.manifest.permissions && item.manifest.permissions.length > 0;
    const coreExtension = item.entityID.startsWith('pc-');
    const hasFooter = item.manifest.website || item.manifest.source || hasSettings || !coreExtension;

    return (
      <Card
        className={`powercord-product${hasSettings ? ' hasSettings' : ''}${hasFooter ? ' hasFooter' : ''}`}
        onClick={() => {
          if (hasSettings && enabled) {
            get('setSection', 'open', 'updateAccount')(item.entityID);
          }
        }}
      >
        <div className='powercord-product-inner'>
          <div className='powercord-product-icon' style={{
            backgroundImage: coreExtension ? 'url("https://i.imgur.com/EeCmmdP.png")' : item.manifest.icon ? `url(${item.manifest.icon})` : null,
            // Non-core extension with no icon specified
            backgroundColor: !item.manifest.icon ? '#7289da' : null
          }}>
            {/* Non-core extensions */}
            {(!item.manifest.icon && !coreExtension) && <Extension/>}
          </div>
          <div className='powercord-product-body'>
            <div className='powercord-product-header'>
              <div className='powercord-product-header-inner'>
                <div className='powercord-product-header-name-version'>
                  {/* {coreExtension && <Tooltip text={'Core Extension'} position='top'>
                    <Atom width={16} height={16} />
                  </Tooltip>} */}
                  <h4 className='name'>{item.manifest.name}</h4>
                  <Tooltip text={Messages.POWERCORD_PLUGINS_VERSION} position='top'>
                    <div className='version'>
                      <span>{item.manifest.version}</span>
                    </div>
                  </Tooltip>
                </div>
                <span className='author'>{item.manifest.author}</span>
              </div>
              <div className='powercord-product-header-section-right'>
                <div className='powercord-product-header-section-right-inner'>
                  {enabled && <Tooltip className='powercord-product-reload-button-container' text={'Reload'} position='top' style={{ marginRight: 10 }}>
                    <Button
                      className={'powercord-product-reload-button'}
                      onClick={async (e) => {
                        e.stopPropagation();
                        const element = e.target.closest('button');
                        element.classList.add('reloading');
                        // @TODO: Needs to be reworked... hacky method.
                        setImmediate(() => powercord.pluginManager.remount(item.entityID));
                        await sleep(1000);
                        element.classList.remove('reloading');
                      }}
                      color={Button.Colors.TRANSPARENT}
                      look={Button.Looks.LINK}
                      size={Button.Sizes.ICON}
                    >
                      <Reload height='18' />
                    </Button>
                  </Tooltip>}
                  <Switch value={enabled} onChange={v => this._toggle(item.entityID, v.target.checked)}/>
                </div>
              </div>
            </div>
            <Details
              svgSize={24}
              description={item.manifest.description}
            />
          </div>
        </div>
        {hasPermissions && <>
          <Divider/>
          <Permissions svgSize={22} permissions={item.manifest.permissions}/>
        </>}
        {(!coreExtension ||
          hasSettings ||
          item.manifest.website ||
          item.manifest.source ||
          item.manifest.website) && <>
          <div className='powercord-product-footer'>
            <Divider/>
            <div className='powercord-product-footer-section-left'>
              {item.manifest.source && <Tooltip text={'Source'} position='top'>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    openExternal(item.manifest.source);
                  }}
                  look={Button.Looks.LINK}
                  size={Button.Sizes.ICON}
                  color={Button.Colors.TRANSPARENT}
                >
                  <GitHubAlt height={21} />
                </Button>
              </Tooltip>}
              {item.manifest.source && <Tooltip text={'Report Issue'} position='top'>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    openExternal(`${item.manifest.source}/issues`);
                  }}
                  look={Button.Looks.LINK}
                  size={Button.Sizes.ICON}
                  color={Button.Colors.TRANSPARENT}
                >
                  <Bug height={20} />
                </Button>
              </Tooltip>}
              {item.manifest.website && <Tooltip text={'Website'} position='top'>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    openExternal(item.manifest.website);
                  }}
                  look={Button.Looks.LINK}
                  size={Button.Sizes.ICON}
                  color={Button.Colors.TRANSPARENT}
                >
                  <Globe height={24}/>
                </Button>
              </Tooltip>}
              <Tooltip text={'Show in Folder'} position='top'>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    shell.openItem(item.entityPath);
                  }}
                  look={Button.Looks.LINK}
                  size={Button.Sizes.ICON}
                  color={Button.Colors.TRANSPARENT}
                >
                  <Folder height={24} />
                </Button>
              </Tooltip>
            </div>
            <div className='powercord-product-footer-section-right'>
              {!coreExtension && <Tooltip text={Messages.APPLICATION_CONTEXT_MENU_UNINSTALL} position='top'>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    // this.setState({ installing: true });
                    this._uninstall(item.entityID);
                  }}
                  disabled={false}
                  color={Button.Colors.RED}
                  look={Button.Looks.FILLED}
                  size={Button.Sizes.ICON}
                >
                  {/* {this.state.installing
                    ? <Spinner type='pulsingEllipsis'/>
                    : <Trash width={18} height={18} />} */}
                  <Trash width={18} height={18} />
                </Button>
              </Tooltip>}
              {(hasSettings && enabled) && <Tooltip text={'Settings'} position='top'>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    get('setSection', 'open', 'updateAccount')(item.entityID);
                  }}
                  disabled={false}
                  color={Button.Colors.GREEN}
                  look={Button.Looks.SOLID}
                  size={Button.Sizes.ICON}
                >
                  <Gear width={22} height={22} />
                </Button>
              </Tooltip>}
            </div>
          </div>
        </>}
      </Card>
    );
  }

  getItems () {
    return this._sortItems([ ...powercord.pluginManager.plugins.values() ]);
  }

  fetchMissing () { // @todo: better impl + i18n
    // noinspection JSIgnoredPromiseFromCall
    powercord.pluginManager.get('pc-moduleManager')._fetchEntities('plugins');
  }

  _toggle (pluginID, enabled) {
    let fn;
    let plugins;
    if (enabled) {
      plugins = [ pluginID ].concat(powercord.pluginManager.get(pluginID).dependencies);
      fn = powercord.pluginManager.enable.bind(powercord.pluginManager);
    } else {
      plugins = [ pluginID ].concat(powercord.pluginManager.get(pluginID).dependents);
      fn = powercord.pluginManager.disable.bind(powercord.pluginManager);
    }

    const apply = async () => {
      for (const plugin of plugins) {
        await fn(plugin);
      }
    };

    if (plugins.length === 1) {
      return apply();
    }

    const title = enabled
      ? Messages.POWERCORD_PLUGINS_ENABLE
      : Messages.POWERCORD_PLUGINS_DISABLE;
    const note = enabled
      ? Messages.POWERCORD_PLUGINS_ENABLE_NOTE
      : Messages.POWERCORD_PLUGINS_DISABLE_NOTE;
    openModal(() => (
      <Confirm
        red={!enabled}
        header={title}
        confirmText={title}
        cancelText={Messages.CANCEL}
        onConfirm={async () => {
          await apply();
          this.forceUpdate();
          closeModal();
        }}
        onCancel={closeModal}
      >
        <div className='powercord-products-modal'>
          <span>{note}</span>
          <ul>
            {plugins.map(p => <li key={p.id}>{powercord.pluginManager.get(p).manifest.name}</li>)}
          </ul>
        </div>
      </Confirm>
    ));
  }

  _uninstall (pluginID) {
    const plugins = [ pluginID ].concat(powercord.pluginManager.get(pluginID).dependents);
    openModal(() => (
      <Confirm
        red
        header={Messages.POWERCORD_PLUGINS_UNINSTALL.format({ pluginCount: plugins.length })}
        confirmText={Messages.POWERCORD_PLUGINS_UNINSTALL.format({ pluginCount: plugins.length })}
        cancelText={Messages.CANCEL}
        onCancel={closeModal}
        onConfirm={async () => {
          for (const plugin of plugins) {
            await powercord.pluginManager.uninstall(plugin);
          }
          this.forceUpdate();
          closeModal();
        }}
      >
        <div className='powercord-products-modal'>
          <span>{Messages.POWERCORD_PLUGINS_UNINSTALL_SURE.format({ pluginCount: plugins.length })}</span>
          <ul>
            {plugins.map(p => <li key={p.id}>{powercord.pluginManager.get(p).manifest.name}</li>)}
          </ul>
        </div>
      </Confirm>
    ));
  }
}

module.exports = Plugins;
