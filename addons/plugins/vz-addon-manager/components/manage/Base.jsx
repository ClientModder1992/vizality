/* eslint-disable no-unused-vars */

const { shell } = require('electron');

const { settings: { TextInput }, ContextMenu, Divider, Icon } = require('@components');
const { string: { toHeaderCase, toPlural } } = require('@util');
const { getModule, contextMenu } = require('@webpack');
const { Messages } = require('@i18n');
const { React } = require('@react');

module.exports = class Base extends React.PureComponent {
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
      <div className='vizality-entities-manage-buttons'>
        <Icon name='OverflowMenu' onClick={e => this.openOverflowMenu(e)} onContextMenu={e => this.openOverflowMenu(e)} />
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
            <div className={getModule('emptyStateImage', 'emptyStateSubtext').emptyStateImage}/>
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
        {/* @todo: Figure out how to use SearchBar component instead */}
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
            name: Messages.VIZALITY_ENTITIES_OPEN_FOLDER.format({ entityType: toHeaderCase(this.state.key) }),
            onClick: () => {
              shell.openItem(eval(`${toPlural(this.state.key).toUpperCase()}_FOLDER`));
            }
          },
          {
            type: 'button',
            name: Messages.VIZALITY_ENTITIES_LOAD_MISSING.format({ entityType: toHeaderCase(this.state.key) }),
            onClick: () => this.fetchMissing(this.state.key)
          }
        ] ]
      })
    );
  }

  async fetchMissing (type) {
    vizality.api.notices.closeToast('vz-addon-manager-fetch-entities');

    const missingEntities = vizality.manager[toPlural(type)].start(true);
    const missingEntitiesList = missingEntities.length
      ? React.createElement('div', null,
        Messages.VIZALITY_MISSING_ENTITIES_RETRIEVED.format({ entity: type, count: missingEntities.length }),
        React.createElement('ul', null, missingEntities.map(entity =>
          React.createElement('li', null, `– ${entity}`))
        )
      )
      : Messages.VIZALITY_MISSING_ENTITIES_NONE;

    vizality.api.notices.sendToast('vz-addon-manager-fetch-entities', {
      header: Messages.VIZALITY_MISSING_ENTITIES_FOUND.format({ entity: type, count: missingEntities.length }),
      content: missingEntitiesList,
      type: missingEntities.length > 0 && 'success',
      icon: type,
      timeout: 5e3,
      buttons: [
        {
          text: 'Got it',
          look: 'ghost'
        }
      ]
    });
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
};
