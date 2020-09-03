const { ImageCarouselModal, Image } = require('@components');
const { React } = require('@webpack');
const { open: openModal } = require('vizality/modal');

const Layout = require('../../parts/Layout');

module.exports = React.memo(() => {
  const Carousel = () => {
    return React.createElement(ImageCarouselModal, {
      className: 'vizality-image-modal',
      items: [
        {
          src: 'https://wallpapercave.com/wp/wp2618282.png'
        },
        {
          src: 'https://wallpapercave.com/wp/wp3102477.jpg'
        },
        {
          src: 'https://wallpapercave.com/wp/wp5998347.jpg'
        },
        {
          src: 'https://wallpapercave.com/wp/wp3102479.jpg'
        },
        {
          src: 'https://wallpapercave.com/wp/wp5102679.jpg'
        }
      ]
    });
  };

  const images = [
    'https://wallpapercave.com/wp/wp2618282.png',
    'https://wallpapercave.com/wp/wp3102477.jpg',
    'https://wallpapercave.com/wp/wp5998347.jpg',
    'https://wallpapercave.com/wp/wp3102479.jpg',
    'https://wallpapercave.com/wp/wp5102679.jpg'
  ];

  return (
    <Layout>
      <div className='vizality-dashboard-addon-screenshots'>
        {images.map(image => <Image
          className='vizality-image'
          src={image}
          onClick={() => openModal(() => Carousel())}
        />)}
      </div>
    </Layout>
  );
});
