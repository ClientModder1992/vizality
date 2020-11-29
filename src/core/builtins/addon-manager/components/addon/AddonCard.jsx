const { Card } = require('@vizality/components');
const { React } = require('@vizality/react');
const { contextMenu: { openContextMenu } } = require('@vizality/webpack');

const Header = require('./parts/Header');
const Footer = require('./parts/Footer');

const AddonContextMenu = require('./AddonContextMenu');

module.exports = React.memo(({ manifest, addonId, isEnabled, onToggle, onUninstall, type, displayType, showPreviewImages }) => {
  const handleContextMenu = e => {
    return openContextMenu(e, () =>
      <AddonContextMenu
        manifest={manifest}
        isEnabled={isEnabled}
        onUninstall={onUninstall}
        type={type}
        addonId={addonId}
        onToggle={onToggle}
      />
    );
  };

  return (
    <Card
      className='vz-addon-card'
      onContextMenu={e => handleContextMenu(e)}
      onClick={e => {
        if (e.target.matches('input')) return;
        vizality.api.router.navigate(`/dashboard/${type}/${addonId}`);
      }}
    >
      <Header
        manifest={manifest}
        isEnabled={isEnabled}
        onToggle={onToggle}
        onUninstall={onUninstall}
        displayType={displayType}
        showPreviewImages={showPreviewImages}
      />
      <Footer onUninstall={onUninstall} isEnabled={isEnabled} displayType={displayType} />
    </Card>
  );
});
