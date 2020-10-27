const imageToBase64 = require('base64-img');
const { readdirSync } = require('fs');
const { join, extname } = require('path');

const { React, React: { useState, useEffect } } = require('@react');
const { open: openModal } = require('vizality/modal');
const { ImageModal, Image } = require('@components');

module.exports = React.memo(() => {
  const [ images, setImages ] = useState([]);

  const convertScreenshotsToBase64 = async () => {
    readdirSync(join(__dirname, 'screenshots'))
      .filter(file => extname(file) === '.png' || extname(file) === '.jpg' || extname(file) === '.jpeg' || extname(file) === '.webp' || extname(file) === '.gif')
      .forEach(file => {
        const image = join(__dirname, 'screenshots', file);
        const img = imageToBase64.base64Sync(image);
        setImages(images => [ ...images, img ]);
      });
  };

  useEffect(() => {
    convertScreenshotsToBase64();
  }, []);

  return (
    <>
      {images.map(image =>
        <Image
          className='vz-image-wrapper'
          src={image}
          onClick={() => {
            openModal(() => <ImageModal className='vz-image-modal' src={image} />);
          }}
        />
      )}
    </>
  );
});
