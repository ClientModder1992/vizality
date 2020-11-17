const { readdirSync, readFileSync } = require('fs');
const { join, extname } = require('path');

const { React, React: { useState, useEffect } } = require('@vizality/react');
const { ImageCarouselModal, Image } = require('@vizality/components');
const { joinClassNames } = require('@vizality/util');

const { open: openModal } = require('@vizality/modal');

module.exports = React.memo(() => {
  const [ images, setImages ] = useState([]);

  const convertImagesToBlobs = () => {
    const validExtensions = [ '.png', '.jpg', '.jpeg', '.webp', '.gif' ];
    const newImages = readdirSync(join(__dirname, 'screenshots'))
      .filter(file => validExtensions.indexOf(extname(file) !== -1))
      .map(file => {
        const image = join(__dirname, 'screenshots', file);
        const buffer = readFileSync(image);
        const ext = extname(file).slice(1);
        const blob = new Blob([ buffer ], { type: `image/${ext}` });
        return URL.createObjectURL(blob);
      });
    setImages(newImages);
  };

  useEffect(() => {
    convertImagesToBlobs();
  }, []);

  useEffect(() => {
    return () => images.forEach(url => URL.revokeObjectURL(url));
  }, [ images ]);

  const Carousel = (items, startsWith) => {
    return <ImageCarouselModal
      className={joinClassNames('vz-image-modal', 'vz-modal-image-carousel')}
      items={[ ...items.map(item => {
        return {
          src: item
        };
      }) ]}
      startWith={startsWith}
    />;
  };

  return (
    <div className='vz-addon-screenshots-grid-wrapper'>
      {images.map((image, index) =>
        <Image
          className='vz-image-wrapper'
          src={image}
          onClick={() => openModal(() => Carousel(images, index))}
        />
      )}
    </div>
  );
});
