/* eslint-disable no-unused-vars */
const { shell } = require('electron');

const { React, Webpack, Localize, Util, Constants, Components } = require('@modules');

module.exports = class Base extends React.PureComponent {
  constructor () {
    super();
    this.state = {
      key: this.constructor.name.toLowerCase().slice(0, -1),
      search: ''
    };
  }

  render () {
    const { colorStandard } = Webpack.getModule('colorStandard');
    return (
      <div className={`vizality-entities-manage ${colorStandard}`}>
        <div className='vizality-entities-manage-header'>
          {this.renderHeader()}
        </div>
        <Components.Divider/>
        {this.renderBody()}
      </div>
    );
  }

  renderHeader () {
    return (
      <span>{Localize.VIZALITY_ENTITIES_INSTALLED.format({ entityType: Util.String.toPascalCase(this.state.key) })}</span>
    );
  }

  renderButtons () {
    return (
      <div className='vizality-entities-manage-buttons'>
        <Components.Icons.Overflow onClick={e => this.openOverflowMenu(e)} onContextMenu={e => this.openOverflowMenu(e)}/>
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
            <div className={Webpack.getModule('emptyStateImage').emptyStateImage}/>
            <p>{Localize.GIFT_CONFIRMATION_HEADER_FAIL}</p>
            <p>{Localize.SEARCH_NO_RESULTS}</p>
          </div>
          : items.map(item => this.renderItem(item))}
      </div>
    );
  }

  renderSearch () {
    return (
      <div className='vizality-entities-manage-search'>
        {/* @todo: Figure out how to use SearchBar component instead */}
        <Components.settings.TextInput
          value={this.state.search}
          onChange={search => this.setState({ search })}
          placeholder={Localize.VIZALITY_ENTITIES_FILTER_PLACEHOLDER}
        >
          {Localize.VIZALITY_ENTITIES_FILTER.format({ entityType: this.state.key })}
        </Components.settings.TextInput>
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
    Webpack.contextMenu.openContextMenu(e, () =>
      React.createElement(Components.ContextMenu, {
        width: '50px',
        itemGroups: [ [
          {
            type: 'button',
            name: Localize.VIZALITY_ENTITIES_OPEN_FOLDER.format({ entityType: Util.String.toPascalCase(this.state.key) }),
            onClick: () => {
              shell.openItem(eval(`${Util.String.toPlural(this.state.key).toUpperCase()}_FOLDER`));
            }
          },
          {
            type: 'button',
            name: Localize.VIZALITY_ENTITIES_LOAD_MISSING.format({ entityType: Util.String.toPascalCase(this.state.key) }),
            onClick: () => this.fetchMissing(this.state.key)
          }
        ] ]
      })
    );
  }

  async fetchMissing (type) {
    vizality.api.notices.closeToast('vz-addons-manager-fetch-entities');

    const missingEntities = vizality.manager[Util.String.toPlural(type)].start(true);
    const missingEntitiesList = missingEntities.length
      ? React.createElement('div', null,
        Localize.VIZALITY_MISSING_ENTITIES_RETRIEVED.format({ entity: type, count: missingEntities.length }),
        React.createElement('ul', null, missingEntities.map(entity =>
          React.createElement('li', null, `– ${entity}`))
        )
      )
      : Localize.VIZALITY_MISSING_ENTITIES_NONE;

    vizality.api.notices.sendToast('vz-addons-manager-fetch-entities', {
      header: Localize.VIZALITY_MISSING_ENTITIES_FOUND.format({ entity: type, count: missingEntities.length }),
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
