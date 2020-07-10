const { join } = require('path');
const { shell } = require('electron');
const { React, getModule, contextMenu, i18n: { Messages } } = require('vizality/webpack');
const { settings: { TextInput }, Button, Tooltip, ContextMenu, Divider, Icons: { Overflow } } = require('vizality/components');
const { string: { toHeaderCase } } = require('vizality/util');

class Base extends React.Component {
  constructor () {
    super();
    this.state = {
      key: this.constructor.name.toLowerCase().slice(0, -1),
      search: ''
    };
  }

  render () {
    const { colorStandard } = getModule('colorStandard');
    return (
      <div className={`vizality-entities-manage ${colorStandard}`}>
        <div className='vizality-entities-manage-header'>
          {this.renderHeader()}
          {this.renderButtons()}
        </div>
        <Divider/>
        {this.renderBody()}
      </div>
    );
  }

  renderHeader () {
    return (
      <span>{Messages.VIZALITY_ENTITIES_INSTALLED.format({ entityType: toHeaderCase(this.state.key) })}</span>
    );
  }

  renderButtons () {
    return (
      <div className='buttons'>
        {vizality.api.labs.isExperimentEnabled('vz-store')
          ? <Button onClick={() => this.goToStore()}>{Messages.VIZALITY_ENTITIES_EXPLORE.format({ entityType: toHeaderCase(this.state.key) })}</Button>
          : <Tooltip text={Messages.COMING_SOON}>
            <Button disabled>{Messages.VIZALITY_ENTITIES_EXPLORE.format({ entityType: toHeaderCase(this.state.key) })}</Button>
          </Tooltip>}
        <Overflow onClick={e => this.openOverflowMenu(e)} onContextMenu={e => this.openOverflowMenu(e)}/>
      </div>
    );
  }

  renderBody () {
    const items = this.getItems();
    return (
      <div className='vizality-entities-manage-items'>
        {this.renderSearch()}
        {items.length === 0
          ? <div className='vizality-entities-manage-items-empty'>
            <div className={getModule('emptyStateImage').emptyStateImage}/>
            <p>{Messages.GIFT_CONFIRMATION_HEADER_FAIL}</p>
            <p>{Messages.SEARCH_NO_RESULTS}</p>
          </div>
          : items.map(item => this.renderItem(item))}
      </div>
    );
  }

  renderSearch () {
    return (
      <div className='vizality-entities-manage-search'>
        <TextInput
          value={this.state.search}
          onChange={search => this.setState({ search })}
          placeholder={Messages.VIZALITY_ENTITIES_FILTER_PLACEHOLDER}
        >
          {Messages.VIZALITY_ENTITIES_FILTER.format({ entityType: this.state.key })}
        </TextInput>
      </div>
    );
  }

  renderItem () {
    return null;
  }

  getItems () {
    return [];
  }

  openOverflowMenu (e) {
    contextMenu.openContextMenu(e, () =>
      React.createElement(ContextMenu, {
        width: '50px',
        itemGroups: [ [
          {
            type: 'button',
            name: Messages.VIZALITY_ENTITIES_OPEN_FOLDER.format({ entityType: `${this.state.key}` }),
            onClick: () => {
              shell.openItem(join(__dirname, '..', '..', '..', '..', `${this.state.key}s`));
            }
          },
          {
            type: 'button',
            name: Messages.VIZALITY_ENTITIES_LOAD_MISSING.format({ entityType: `${this.state.key}` }),
            onClick: () => this.fetchMissing()
          }
        ] ]
      })
    );
  }

  async goToStore () {
    const { popLayer } = getModule('popLayer');
    const { transitionTo } = getModule('transitionTo');
    popLayer();
    transitionTo(`/_vizality/store/${this.state.key}`);
  }

  fetchMissing () {
    vizality.pluginManager.get('vz-module-manager')._fetchEntities(`${this.state.key}s`);
  }

  _sortItems (items) {
    if (this.state.search && this.state.search !== '') {
      const search = this.state.search.toLowerCase();
      items = items.filter(p =>
        p.manifest.name.toLowerCase().includes(search) ||
        p.manifest.author.toLowerCase().includes(search) ||
        p.manifest.description.toLowerCase().includes(search)
      );
    }

    return items.sort((a, b) => {
      const nameA = a.manifest.name.toLowerCase();
      const nameB = b.manifest.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });
  }
}

module.exports = Base;
