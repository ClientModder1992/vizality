const { contextMenu: { openContextMenu } } = require('@vizality/webpack');
const { string: { toPlural } } = require('@vizality/util');
const { React } = require('@vizality/react');
// const { Card } = require('@vizality/components');

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
    <div
      className='vz-addon-card'
      onContextMenu={e => handleContextMenu(e)}
      onClick={e => {
        if (e.target.matches('input')) return;
        vizality.api.router.navigate(`/vizality/dashboard/${toPlural(type)}/${addonId}`);
      }}
    >
      <Inner {...props} />
    </div>
  );
});
