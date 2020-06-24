const { React, getModule, i18n: { Messages } } = require('vizality/webpack');
const { TabBar } = require('vizality/components');
const ThemeSettings = require('./ThemeSettings');
const QuickCSS = require('./QuickCSS');
const Base = require('./Base');

class Themes extends Base {
  constructor () {
    super();
    this.state.tab = 'INSTALLED';
    // this.state.settings = 'Customa-Discord';
  }

  render () {
    if (this.state.settings) {
      return (
        <ThemeSettings theme={this.state.settings} onClose={() => this.setState({ settings: null })}/>
      );
    }

    const { topPill, item } = getModule([ 'topPill' ], false);
    return (
      <>
        <div className='vizality-entities-manage-tabs'>
          <TabBar
            selectedItem={this.state.tab}
            onItemSelect={tab => this.setState({ tab })}
            type={topPill}
          >
            <TabBar.Item className={item} selectedItem={this.state.tab} id='INSTALLED'>
              {Messages.MANAGE_USER_SHORTHAND}
            </TabBar.Item>
            <TabBar.Item className={item} selectedItem={this.state.tab} id='QUICK_CSS'>
              {Messages.VIZALITY_QUICKCSS}
            </TabBar.Item>
          </TabBar>
        </div>
        {this.state.tab === 'INSTALLED'
          ? super.render()
          : <QuickCSS openPopout={this.props.openPopout}/>}
      </>
    );
  }

  renderBody () {
    if (!vizality.api.labs.isExperimentEnabled('vz-module-manager-themes2')) {
      return (
        <div className='vizality-plugin-soon vizality-text'>
          <div className='wumpus'>
            <img src='/assets/8c998f8fb62016fcfb4901e424ff378b.svg' alt='wumpus'/>
          </div>
          <p>{Messages.VIZALITY_THEMES_WIP1}</p>
          <p>{Messages.VIZALITY_THEMES_WIP2}</p>
        </div>
      );
    }
    return super.renderBody();
  }

  // eslint-disable-next-line no-unused-vars
  renderItem (item) {
    console.log(item);
    // return 'mhm';
  }

  fetchMissing () { // @todo: better impl + i18n
    // noinspection JSIgnoredPromiseFromCall
    vizality.pluginManager.get('vz-module-manager')._fetchEntities('themes');
  }

  getItems () {
    return this._sortItems([ ...vizality.styleManager.themes.values() ].filter(t => t.isTheme));
  }
}

module.exports = Themes;
