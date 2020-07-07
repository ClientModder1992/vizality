const { React, Flux, getModule, getModuleByDisplayName, i18n: { Messages } } = require('vizality/webpack');
const { TabBar, Divider, Button, AsyncComponent } = require('vizality/components');

const InstalledProduct = require('../parts/InstalledProduct');

const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle'));

class ThemeSettings extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      errors: {},
      theme: vizality.styleManager.get(props.theme),
      tab: 'SETTINGS'
    };

    this.applySettings = global._.debounce(this.applySettings.bind(this), 1000);
  }

  render () {
    const { theme } = this.state;
    if (!theme) {
      return this.renderWtf();
    }
    const { manifest: { name, plugins } } = theme;
    const settings = this.getApplicableSettings();
    const hasSettings = settings && settings.length !== 0;
    const hasPlugins = plugins && plugins.length !== 0;
    const hasBoth = hasSettings && hasPlugins;
    if (!hasSettings && !hasPlugins) {
      return this.renderWtf();
    }

    return (
      <div className='vizality-entities-manage vizality-text'>
        <div className='vizality-entities-manage-header'>
          <span>{name}</span>
          <div className='buttons'>
            <Button onClick={() => this.props.onClose()}>Save & Quit</Button>
          </div>
        </div>
        <Divider/>
        {hasBoth && this.renderTopPills()}
        {((hasBoth && this.state.tab === 'SETTINGS') || (!hasBoth && hasSettings)) && this.renderSettings(settings)}
        {((hasBoth && this.state.tab === 'PLUGINS') || (!hasBoth && hasPlugins)) && this.renderPlugins()}
      </div>
    );
  }

  renderTopPills () {
    const { topPill, item } = getModule('topPill');
    return (
      <div className='vizality-entities-manage-tabs'>
        <TabBar
          selectedItem={this.state.tab}
          onItemSelect={tab => this.setState({ tab })}
          type={topPill}
        >
          <TabBar.Item className={item} selectedItem={this.state.tab} id='SETTINGS'>
            Theme Settings
          </TabBar.Item>
          <TabBar.Item className={item} selectedItem={this.state.tab} id='PLUGINS'>
            CSS Plugins
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }

  renderSettings (settings) {
    return settings.map(setting => this.renderSettingsGroup(setting.name, setting.options));
  }

  renderSettingsGroup (groupName, options) {
    console.log(options);
    return (
      <div className='vizality-entities-settings-group' key={groupName}>
        <FormTitle tag='h2'>{groupName}</FormTitle>
      </div>
    );
  }

  renderPlugins () {
    const { manifest: { author, version, license, plugins } } = this.state.theme;
    if (plugins.length === 0) {
      return this.renderWtf();
    }
    return plugins.map(plugin => (
      <InstalledProduct
        isEnabled={this.props.getSetting('_enabledPlugins', []).includes(plugin.file)}
        product={{
          name: plugin.name,
          description: plugin.description,
          author: plugin.author || author,
          version: plugin.version || version,
          license: plugin.license || license
        }}
        onToggle={v => {
          const enabled = this.props.getSetting('_enabledPlugins', []);
          if (v) {
            this.props.updateSetting('_enabledPlugins', enabled.concat(plugin.file));
          } else {
            this.props.updateSetting('_enabledPlugins', enabled.filter(e => e !== plugin.file));
          }
        }}
      />
    ));
  }

  renderWtf () {
    return (
      <div
        style={{
          fontSize: 69,
          marginTop: 69,
          textAlign: 'center',
          fontFamily: '"Comic Sans MS", "Comic Sans", cursive'
        }}
      >
        {Messages.SETTINGS_GAMES_NOT_PLAYING}
      </div>
    );
  }

  getApplicableSettings () {
    const settings = [];
    if (this.state.theme.manifest.settings) {
      settings.push({
        name: 'Theme Settings',
        options: this.state.theme.manifest.settings.options
      });
    }
    for (const plugin of this.state.theme.manifest.plugins.filter(p => p.settings)) {
      if (this.props.getSetting('_enabledPlugins', []).includes(plugin.file)) {
        settings.push({
          name: plugin.name,
          options: plugin.settings.options
        });
      }
    }
    return settings;
  }

  applySettings () {
    console.log('yes');
  }
}

module.exports = Flux.connectStores(
  [ vizality.api.settings.store ],
  ({ theme }) => ({
    ...vizality.api.settings._fluxProps(`theme-${theme}`)
  })
)(ThemeSettings);
