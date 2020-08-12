const { Tooltip, Clickable, HeaderBar, AsyncComponent, Icons: { Plugin: PluginIcon, Theme, CloudUpload, Certificate, Server } } = require('@components');
const { React, Flux, getModule, getModuleByDisplayName } = require('@webpack');

// const Product = require('../brrrrr/items/Products/Product');
const VerticalScroller = AsyncComponent.from(getModuleByDisplayName('VerticalScroller'));
const SearchBox = AsyncComponent.from(getModuleByDisplayName('GuildDiscoverySearchBar'));

class Store extends React.Component {
  constructor (props) {
    super(props);
    const words = [ 'spicy', 'epic', 'awesome', 'caffeine-powered', 'useful', 'cool', 'cute' ];
    this.state = {
      search: '',
      focused: false,
      word: words[Math.floor(Math.random() * words.length)],
      type: location.href.split('/').pop()
    };
  }

  doSearch () {
    const input = document.querySelector('.vizality-store-search input');
    if (input) {
      input.blur();
    }
    console.log(this.state.search);
  }

  clearSearch () {
    const input = document.querySelector('.vizality-store-search input');
    if (input) {
      input.blur();
    }

    this.setState({
      search: '',
      focused: false
    });
  }

  render () {
    return void 0;
    const classes = {
      background: getModule('bg', 'layer').bg,
      quickSelectArrow: getModule('quickSelectArrow').quickSelectArrow,
      topic: getModule('topic', 'expandable').topic,
      headerBar: getModule('iconWrapper', 'clickable'),
      store: getModule('storeHomeWidth', 'container')
    };

    const { headerBar, store } = classes;
    return <div className='vizality-text vizality-store'>
      <HeaderBar transparent={false} toolbar={this.renderToolbar()}>
        <div className={headerBar.iconWrapper}>
          {this.state.type === 'plugins'
            ? <PluginIcon className={headerBar.icon} width={24} height={24}/>
            : <Theme className={headerBar.icon} width={24} height={24}/>}
        </div>
        <HeaderBar.Title>Browse {this.state.type[0].toUpperCase() + this.state.type.slice(1)}</HeaderBar.Title>
      </HeaderBar>
      <img className={classes.background} alt='background' src={this.props.images.background}/>
      <VerticalScroller outerClassName={[ store.container, 'vizality-store-container' ].join(' ')}>
        <div className='vizality-store-body'>
          <SearchBox
            placeholder={`Search for ${this.state.word} ${this.state.type}...`}
            searchTerm={this.state.search}
            focused={this.state.focused}
            onFocus={() => this.setState({ focused: true })}
            onBlur={() => this.setState({ focused: false })}
            onChange={search => this.setState({ search })}
            onClear={() => this.clearSearch()}
            onKeyPress={e => e.charCode === 13 && this.doSearch()}
            autoFocus={false}
          />
          {this.renderFilters()}
          {this.renderList()}
        </div>
      </VerticalScroller>
    </div>;
  }

  renderToolbar () {
    const classes = {
      background: getModule('bg', 'layer').bg,
      quickSelectArrow: getModule('quickSelectArrow').quickSelectArrow,
      topic: getModule('topic', 'expandable').topic,
      headerBar: getModule('iconWrapper', 'clickable'),
      store: getModule('storeHomeWidth', 'container')
    };

    const { topic, headerBar } = classes;

    return <>
      <div className={topic}>Get in touch:</div>
      <Tooltip text={`Publish a ${this.state.type.slice(0, -1)}`} position='bottom'>
        <Clickable className={[ headerBar.iconWrapper, headerBar.clickable ].join(' ')}>
          <CloudUpload className={headerBar.icon}/>
        </Clickable>
      </Tooltip>
      <Tooltip text='Verification' position='bottom'>
        <Clickable className={[ headerBar.iconWrapper, headerBar.clickable ].join(' ')}>
          <Certificate className={headerBar.icon}/>
        </Clickable>
      </Tooltip>
      {this.state.type === 'plugins' && <Tooltip text='Hosting' position='bottom'>
        <Clickable className={[ headerBar.iconWrapper, headerBar.clickable ].join(' ')}>
          <Server className={headerBar.icon}/>
        </Clickable>
      </Tooltip>}
    </>;
  }

  renderFilters () {
    const classes = {
      background: getModule('bg', 'layer').bg,
      quickSelectArrow: getModule('quickSelectArrow').quickSelectArrow,
      topic: getModule('topic', 'expandable').topic,
      headerBar: getModule('iconWrapper', 'clickable'),
      store: getModule('storeHomeWidth', 'container')
    };

    return <>
      <div className='vizality-store-filters'>
        <div className='filter'>
          <div className='label'>Browsing:</div>
          <div className='value'>All {this.state.type}</div>
          <div className={classes.quickSelectArrow}/>
        </div>
        <div className='filter'>
          <div className='label'>Type:</div>
          <div className='value'>Cute</div>
          <div className={classes.quickSelectArrow}/>
        </div>
        <div className='filter'>
          <div className='label'>Sort by:</div>
          <div className='value'>Newest</div>
          <div className={classes.quickSelectArrow}/>
        </div>
      </div>
    </>;
  }

  renderList () {
    // @todo: do it but it's not shit and uses new manifest format
    return <>
      <div className={[ 'vizality-store-products', this.state.focused ? 'faded' : '' ].join(' ')}>
        {[ ...vizality.manager[this.state.type].values() ].map(entity => <Product product={entity} type={this.state.type}/>)}
      </div>
    </>;
  }
}

const images = {
  dark: {
    background: '/assets/c486dc65ce2877eeb18e4c39bb49507a.svg'
  },
  light: {
    background: '/assets/8c1fd3ecbbf620ec49cecda2aa53f256.svg'
  }
};

module.exports = Flux.connectStoresAsync([ getModule('theme') ], ([ settingsStore ]) => ({ images: images[settingsStore.theme] }))(Store);
