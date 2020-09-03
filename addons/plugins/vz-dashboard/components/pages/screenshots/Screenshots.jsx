const imageToBase64 = require('image-to-base64');
const { readdirSync } = require('fs');
const { join, extname } = require('path');

const { ImageModal, Image } = require('@components');
const { React, React: { useState, useEffect } } = require('@webpack');
const { open: openModal } = require('vizality/modal');

const Content = require('../../parts/Content');
const Layout = require('../../parts/Layout');

module.exports = React.memo(() => {
  const [ images, setImages ] = useState([]);

  const convertScreenshotsToBase64 = async () => {
    readdirSync(join(__dirname, 'screenshots'))
      .filter(file => extname(file) === '.png' || extname(file) === '.jpg' || extname(file) === '.jpeg' || extname(file) === '.webp')
      .forEach(file => {
        const image = join(__dirname, 'screenshots', file);
        imageToBase64(image)
          .then(response => {
            setImages(images => [ ...images, `data:image/${extname(image).substring(1)};base64,${response}` ]);
          })
          .catch(err => console.error(err));
      });
  };

  useEffect(() => {
    convertScreenshotsToBase64();
  }, []);

  return (
    <Layout>
      <Content className='vizality-dashboard-addon-screenshots'>
        {images.map(image => <Image className='vizality-image' src={image}
          onClick={() => {
            openModal(() => React.createElement(ImageModal, {
              className: 'vizality-image-modal',
              src: image
            }));
          }} />)}
      </Content>
    </Layout>
  );
});
