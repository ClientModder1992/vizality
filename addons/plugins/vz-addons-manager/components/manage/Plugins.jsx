const { React, getModule, getModuleByDisplayName, i18n: { Messages } } = require('@webpack');
const { open: openModal, close: closeModal } = require('vizality/modal');
const { Confirm } = require('@components/modal');
const { TabBar } = require('@components');

const InstalledProduct = require('../parts/InstalledProduct');
const Base = require('./Base');

class Plugins extends Base {
  constructor () {
    super();

    this.state = {
      tab: 'INSTALLED',
      key: this.constructor.name.toLowerCase().slice(0, -1)
    };
  }

  render () {
    const { item } = getModule('item', 'topPill');
    const { Types } = getModuleByDisplayName('TabBar');
    return (
      <>
        <div className='vizality-entities-manage-tabs'>
          <TabBar
            selectedItem={this.state.tab}
            onItemSelect={tab => this.setState({ tab })}
            type={Types.TOP_PILL}
          >
            <TabBar.Item className={item} selectedItem={this.state.tab} id='INSTALLED'>
              {Messages.VIZALITY_INSTALLED}
            </TabBar.Item>
            <TabBar.Item className={item} selectedItem={this.state.tab} id='DISCOVER'>
              {Messages.DISCOVER}
            </TabBar.Item>
          </TabBar>
          {super.renderButtons()}
        </div>
        {this.state.tab === 'INSTALLED'
          ? super.render()
          : this.state.tab === 'DISCOVER'
            ? console.log('cheese man')
            : null}
      </>
    );
  }

  renderItem (item) {
    return (
      <InstalledProduct
        product={item.manifest}
        isEnabled={vizality.pluginManager.isEnabled(item.entityID)}
        onToggle={async v => {
          await this._toggle(item.entityID, v);
          this.forceUpdate();
        }}
        onUninstall={() => this._uninstall(item.entityID)}
      />
    );
  }

  getItems () {
    return this._sortItems([ ...vizality.pluginManager.plugins.values() ]);
  }

  _toggle (pluginID, enabled) {
    let fn;
    let plugins;
    if (enabled) {
      plugins = [ pluginID ].concat(vizality.pluginManager.get(pluginID).dependencies);
      fn = vizality.pluginManager.enable.bind(vizality.pluginManager);
    } else {
      plugins = [ pluginID ].concat(vizality.pluginManager.get(pluginID).dependents);
      fn = vizality.pluginManager.disable.bind(vizality.pluginManager);
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
      ? Messages.VIZALITY_ENTITIES_ENABLE.format({ entityType: this.state.key })
      : Messages.VIZALITY_ENTITIES_DISABLE.format({ entityType: this.state.key });
    const note = enabled
      ? Messages.VIZALITY_ENTITIES_ENABLE_NOTE.format({ entityType: this.state.key })
      : Messages.VIZALITY_ENTITIES_DISABLE_NOTE.format({ entityType: this.state.key });
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
        <div className='vizality-entity-modal'>
          <span>{note}</span>
          <ul>
            {plugins.map(p => <li key={p.id}>{vizality.pluginManager.get(p).manifest.name}</li>)}
          </ul>
        </div>
      </Confirm>
    ));
  }

  _uninstall (pluginID) {
    const plugins = [ pluginID ].concat(vizality.pluginManager.get(pluginID).dependents);
    openModal(() => (
      <Confirm
        red
        header={Messages.VIZALITY_ENTITIES_UNINSTALL.format({ entityType: this.state.key, count: plugins.length })}
        confirmText={Messages.VIZALITY_ENTITIES_UNINSTALL.format({ entityType: this.state.key, count: plugins.length })}
        cancelText={Messages.CANCEL}
        onCancel={closeModal}
        onConfirm={async () => {
          for (const plugin of plugins) {
            await vizality.pluginManager.uninstall(plugin);
          }
          this.forceUpdate();
          closeModal();
        }}
      >
        <div className='vizality-entity-modal'>
          <span>{Messages.VIZALITY_ENTITIES_UNINSTALL_SURE.format({ entity: this.state.key, count: plugins.length })}</span>
          <ul>
            {plugins.map(p => <li key={p.id}>{vizality.pluginManager.get(p).manifest.name}</li>)}
          </ul>
        </div>
      </Confirm>
    ));
  }
}

module.exports = Plugins;
