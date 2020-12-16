const { React, React: { memo, useState, useEffect } } = require('@vizality/react');
const { ImageCarouselModal, Icon } = require('@vizality/components');
const { open: openModal } = require('@vizality/modal');

module.exports = memo(props => {
  const { size, previewImages } = props;
  const [ previews, setPreviews ] = useState([]);

  const getPreviewImages = () => {
    const previewImgs = [];
    // eslint-disable-next-line array-callback-return
    previewImages.forEach(image => {
      previewImgs.push({
        src: image
      });
    });
    setPreviews(previewImgs);
  };

  useEffect(() => {
    getPreviewImages();
  }, []);

  return (
    <div className='vz-addon-card-show-previews-button'>
      <Icon
        className='vz-addon-card-show-previews-button-icon-wrapper'
        iconClassName='vz-addon-card-show-previews-button-icon'
        name='Eye'
        size={size}
        tooltip='Previews'
        onMouseUp={() => openModal(() => <ImageCarouselModal items={previews} />)}
      />
    </div>
  );
});
