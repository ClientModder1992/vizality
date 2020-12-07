const { contextMenu: { openContextMenu } } = require('@vizality/webpack');
const { string: { toPlural } } = require('@vizality/util');
const { Card } = require('@vizality/components');
const { React } = require('@vizality/react');

const AddonContextMenu = require('./AddonContextMenu');
const Inner = require('./parts/Inner');

module.exports = React.memo(props => {
  const { type, addonId } = props;

  const handleContextMenu = e => {
    return openContextMenu(e, () =>
      <AddonContextMenu {...props} />
    );
  };

  return (
    <Card
      className='vz-addon-card'
      onContextMenu={e => handleContextMenu(e)}
      onClick={e => {
        if (e.target.matches('input')) return;
        vizality.api.router.navigate(`/dashboard/${toPlural(type)}/${addonId}`);
      }}
    >
      <Inner {...props} />
    </Card>
  );
});
