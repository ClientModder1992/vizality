const { sleep, string: { toPascalCase, toCamelCase } } = require('@util');
const { PopoutWindow, Spinner } = require('@components');
const { React, Flux, getModule } = require('@webpack');
const { CDN: { DOCS_CDN } } = require('@constants');
const { get } = require('@http');

const SettingsView = require('./SettingsView');
const DocPage = require('./DocPage');

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
    // const baseUrl = vizality.settings.get('backendURL', WEBSITE);
    const baseUrl = 'https://powercord.dev';
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
      onClose={() => getModule('popLayer').popLayer()}
      onSetSection={section => {
        if (section.startsWith('_part/')) {
          this.scrollTo(section.split('/').pop());
        } else if (this.state.section === section) {
          this.scrollTo(section);
        } else {
          this.setState({ section });
          this.scrollTo(section);
        }
      }}
    />;
  }

  async _setActive (part) {
    const parts = document.querySelectorAll(`[class^='vz-part']`);
    for (const p of parts) {
      if (!p.classList.value.includes(toPascalCase(part))) {
        p.classList.remove('active');
      } else {
        p.classList.add('active');
      }
    }
  }

  async scrollTo (part) {
    const { contentRegionScroller } = getModule('contentRegionScroller');
    const scroller = document.querySelector(`.vizality-documentation .${contentRegionScroller}`);
    if (part && document.getElementById(part)) {
      this._setActive(part);
      const partElement = document.getElementById(part);
      partElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      const section = document.querySelector(`.vz-${toCamelCase(part)}Item`);
      await sleep(20);
      if (section && section.nextSibling.classList.value.includes('vz-part')) {
        const parts = document.querySelectorAll(`[class^='vz-part']`);
        for (const p of parts) {
          if (p !== section.nextSibling) {
            p.classList.remove('active');
          } else {
            p.classList.add('active');
          }
        }
      }
      scroller.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  openPopout () {
    getModule('popLayer').popLayer();
    getModule('setAlwaysOnTop', 'open').open('DISCORD_VIZALITY_DOCUMENTATION', (key) => (
      <PopoutWindow windowKey={key}>
        <ConnectedDocsLayer popout={true}/>
      </PopoutWindow>
    ));
  }
}

const ConnectedDocsLayer = Flux.connectStoresAsync(
  [ getModule('theme'), getModule('darkSidebar'), getModule('getWindow') ],
  ([ themeStore, sidebarStore, windowStore ]) => ({
    guestWindow: windowStore.getWindow('DISCORD_VIZALITY_DOCUMENTATION'),
    windowOnTop: windowStore.getIsAlwaysOnTop('DISCORD_VIZALITY_DOCUMENTATION'),
    sidebarTheme: sidebarStore.darkSidebar ? 'dark' : void 0,
    theme: themeStore.theme
  })
)(DocsLayer);

module.exports = ConnectedDocsLayer;
