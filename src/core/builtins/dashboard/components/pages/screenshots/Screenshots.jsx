import React, { memo, useState, useEffect } from 'react';
import { readdirSync, readFileSync } from 'fs';
import { join, extname } from 'path';

import { ImageModal, Image } from '@vizality/components';
import { open as openModal } from '@vizality/modal';

export default memo(() => {
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

  return (
    <div className='vz-addon-screenshots-grid-wrapper'>
      {images.map(url =>
        <Image
          className='vz-image-wrapper'
          src={url}
          onClick={() => openModal(() => <ImageModal className='vz-image-modal' src={url} />)}
        />
      )}
    </div>
  );
});
