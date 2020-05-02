const { React, get } = require('powercord/webpack');
const { Card } = require('powercord/components');

const Header = require('./parts/InstalledHeader');
const Container = require('./parts/InstalledDetails');
const Permissions = require('./parts/Permissions');
const Footer = require('./parts/InstalledFooter');

module.exports = class Installed extends React.Component {
  render () {
    const {
      // @todo: more generic
      plugin: { entityID: id, manifest }, enabled, // Properties
      onClick, onEnable, onDisable, onInstall, onUninstall // Events
    } = this.props;

    return <Card
      className='powercord-plugin'
      // onClick={() => get('setSection', 'open', 'updateAccount')(id) }
    >
      <Header
        id={id}
        icon={manifest.icon ? manifest.icon : null}
        name={manifest.name}
        version={manifest.version}
        author={manifest.author}
        enabled={enabled}
        onClick={onClick}
        onEnable={onEnable}
        onDisable={onDisable}
      />
      <Container
        description={manifest.description}
      />
      {(manifest.permissions || []).length > 0 && <Permissions svgSize={22} permissions={manifest.permissions}/>}
      <Footer
        id={id}
        source={manifest.source && manifest.source.startsWith('https://github.com/') ? manifest.source : ''}
        website={manifest.website && manifest.website.startsWith('http') ? manifest.website : ''}
        buttons
        enabled={enabled}
        onUninstall={() => {
          onUninstall();
        }}
        onInstall={() => {
          onInstall();
        }}
      />
    </Card>;
  }
};
