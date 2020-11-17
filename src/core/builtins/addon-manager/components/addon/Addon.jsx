const { Card } = require('@vizality/components');
const { React } = require('@vizality/react');

const Description = require('./parts/Description');
const Permissions = require('./parts/Permissions');
const Header = require('./parts/Header');
const Footer = require('./parts/Footer');

module.exports = React.memo(({ manifest, addonId, isEnabled, onToggle, onUninstall }) => {
  return (
    <Card className='vz-addon-card' onClick={(e) => {
      if (e.target.matches('input')) return;
      vizality.api.router.navigate(`/dashboard/plugins/${addonId}`);
    }}>
      <div className='vz-addon-card-inner'>
        <Header
          manifest={manifest}
          isEnabled={isEnabled}
          onToggle={onToggle}
        />
        <Description description={manifest.description} />
        <Permissions permissions={manifest.permissions} />
        <Footer onUninstall={onUninstall} />
      </div>
    </Card>
  );
});
