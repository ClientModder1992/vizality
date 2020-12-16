const { contextMenu: { openContextMenu } } = require('@vizality/webpack');
const { React, React: { memo } } = require('@vizality/react');
const { string: { toPlural } } = require('@vizality/util');

const AddonContextMenu = require('./AddonContextMenu');
const Inner = require('./parts/Inner');

module.exports = memo(props => {
  const { type, addonId, hasPreviewImages, previewImages } = props;

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
        if (e.target.classList.contains('smallCarouselImage-2Qvg9S')) return;
        if (e.target.matches('input') || e.target.matches('button') || e.target.matches('svg') || e.target.matches('a')) return;

        vizality.api.router.navigate(`/vizality/dashboard/${toPlural(type)}/${addonId}`);
      }}
    >
      <Inner {...props} hasPreviewImages={hasPreviewImages} previewImages={previewImages} />
    </div>
  );
});
