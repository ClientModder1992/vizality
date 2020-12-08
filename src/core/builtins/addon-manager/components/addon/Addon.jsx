const { contextMenu: { openContextMenu } } = require('@vizality/webpack');
const { string: { toPlural } } = require('@vizality/util');
const { React } = require('@vizality/react');

const AddonContextMenu = require('./AddonContextMenu');
const Compact = require('./displays/Compact');
const Cover = require('./displays/Cover');
const List = require('./displays/List');
const Card = require('./displays/Card');

module.exports = React.memo(props => {
  const { type, addonId, display } = props;

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
      {display === 'compact'
        ? <Compact {...props} />
        : display === 'cover'
          ? <Cover {...props} />
          : display === 'list'
            ? <List {...props} />
            : <Card {...props} />
      }
    </div>
  );
});
