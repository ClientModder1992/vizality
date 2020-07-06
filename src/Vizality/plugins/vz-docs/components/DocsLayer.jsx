const { React, Flux, getModule } = require('vizality/webpack');
const { PopoutWindow, Spinner } = require('vizality/components');
const { react: { getOwnerInstance } } = require('vizality/util');
const { WEBSITE } = require('vizality/constants');
const { get } = require('vizality/http');
const DocPage = require('./DocPage');
const SettingsView = require('./SettingsView');

let sectionsCache = [
  {
    section: 'loading',
    label: 'Loading...',
    element: () => <Spinner/>
  }
];

class DocsLayer extends React.PureComponent {
  constructor () {
    super();
    this.state = {
      sections: sectionsCache,
      section: 'loading'
    };
  }

  async componentDidMount () {
    const baseUrl = vizality.settings.get('backendURL', WEBSITE);
    const sections = await get(`${baseUrl}/api/v2/docs/categories`).then(res => res.body).then(s => s.sort((a, b) => a.metadata.pos > b.metadata.pos ? 1 : -1));
    sectionsCache = [];
    sections.forEach(section => {
      sectionsCache.push(
        { section: 'DIVIDER' },
        {
          section: 'HEADER',
          label: section.metadata.name
        },
        ...section.docs.map(doc => {
          const tab = {
            section: `${section.id}/${doc.id}`,
            label: doc.name,
            element: () => (
              <DocPage
                doc={doc.id}
                category={section.id}
                setSection={section => this.setState({ section })}
                onScrollTo={(part) => this.scrollTo(part)}
              />
            )
          };
          return [
            tab,
            ...doc.parts.map(part => ({
              section: `_part/${section.id}/${doc.id}/${part.replace(/[^\w]+/ig, '-').replace(/^-+|-+$/g, '').toLowerCase()}`,
              label: part,
              predicate: () => this.state.section === tab.section
            }))
          ];
        }).flat()
      );
    });
    sectionsCache.shift();
    this.setState({
      sections: sectionsCache,
      section: sectionsCache[1].section
    });
  }

  render () {
    return <SettingsView
      sections={this.state.sections}
      section={this.state.section}
      theme={this.props.theme}
      sidebarTheme={this.props.sidebarTheme}
      guestWindow={this.props.guestWindow}
      windowOnTop={this.props.windowOnTop}
      popout={this.props.popout}
      onPopout={() => this.openPopout()}
      onClose={() => getModule([ 'popLayer' ]).popLayer()}
      onSetSection={section => {
        if (section.startsWith('_part/')) {
          this.scrollTo(section.split('/').pop());
        } else if (this.state.section === section) {
          this.scrollTo();
        } else {
          this.setState({ section });
        }
      }}
    />;
  }

  scrollTo (part) {
    const element = document.querySelector('.vizality-documentation div + div > div > div');
    const scroller = getOwnerInstance(element);
    if (part) {
      const partElement = document.getElementById(part);
      scroller.scrollIntoView(partElement);
    } else {
      scroller.scrollTo(0);
    }
  }

  openPopout () {
    getModule([ 'popLayer' ]).popLayer();
    getModule([ 'setAlwaysOnTop', 'open' ]).open('DISCORD_VIZALITY_DOCUMENTATION', (key) => (
      <PopoutWindow windowKey={key}>
        <ConnectedDocsLayer popout={true}/>
      </PopoutWindow>
    ));
  }
}

const ConnectedDocsLayer = Flux.connectStoresAsync(
  [ getModule([ 'theme' ], true), getModule([ 'darkSidebar' ], true), getModule([ 'getWindow' ], true) ],
  ([ themeStore, sidebarStore, windowStore ]) => ({
    guestWindow: windowStore.getWindow('DISCORD_VIZALITY_DOCUMENTATION'),
    windowOnTop: windowStore.getIsAlwaysOnTop('DISCORD_VIZALITY_DOCUMENTATION'),
    sidebarTheme: sidebarStore.darkSidebar ? 'dark' : void 0,
    theme: themeStore.theme
  })
)(DocsLayer);

module.exports = ConnectedDocsLayer;
