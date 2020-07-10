const { React, getModule, i18n: { Messages } } = require('vizality/webpack');
const { TabBar } = require('vizality/components');
const QuickCSS = require('./QuickCSS');
const Base = require('./Base');

class Themes extends Base {
  constructor () {
    super();
    this.state = {
      tab: 'INSTALLED',
      key: this.constructor.name.toLowerCase().slice(0, -1)
    };
  }

  render () {
    const { topPill, item } = getModule('topPill');
    return (
      <>
        <div className='vizality-entities-manage-tabs'>
          <TabBar
            selectedItem={this.state.tab}
            onItemSelect={tab => this.setState({ tab })}
            type={topPill}
          >
            <TabBar.Item className={item} selectedItem={this.state.tab} id='INSTALLED'>
              {Messages.VIZALITY_INSTALLED}
            </TabBar.Item>
            <TabBar.Item className={item} selectedItem={this.state.tab} id='DISCOVER'>
              {Messages.DISCOVER}
            </TabBar.Item>
            <TabBar.Item className={item} selectedItem={this.state.tab} color={'#43b581'} id='QUICK_CSS'>
              {Messages.VIZALITY_QUICKCSS}
            </TabBar.Item>
          </TabBar>
        </div>
        {this.state.tab === 'INSTALLED'
          ? super.render()
          : this.state.tab === 'DISCOVER'
            ? console.log('cheese man')
            : <QuickCSS openPopout={this.props.openPopout}/>}
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
}

module.exports = Themes;
