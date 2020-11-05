const { getModule, getModuleByDisplayName } = require('@vizality/webpack');
const { TabBar } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');
const { React } = require('@vizality/react');

const Base = require('./Base');

module.exports = class Themes extends Base {
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

  renderBody () {
    return super.renderBody();
  }

  // eslint-disable-next-line no-unused-vars
  renderItem (item) {
    console.log(item);
    // return 'mhm';
  }

  getItems () {
    return this._sortItems([ ...vizality.styleManager.themes.values() ].filter(t => t.isTheme));
  }
};
