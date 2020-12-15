const { existsSync, lstatSync, readdirSync } = require('fs');
const { join, extname } = require('path');

const { ApplicationStoreListingCarousel } = require('@vizality/components');
const { string: { toPlural } } = require('@vizality/util');
const { React, React: { useEffect, useState } } = require('@vizality/react');

module.exports = React.memo(props => {
  const { addonId, type } = props;
  const [ previewImages, setPreviewImages ] = useState([]);

  const addon = vizality.manager[toPlural(type)].get(addonId);
  const screenshotsDir = join(addon.addonPath, 'screenshots');
  const hasScreenshotsDir = existsSync(screenshotsDir) && lstatSync(screenshotsDir).isDirectory();

  const getPreviewImages = () => {
    if (!hasScreenshotsDir) return;
    const previewImages = [];
    const validExtensions = [ '.png', '.jpg', '.jpeg', '.webp' ];

    readdirSync(join(addon.addonPath, 'screenshots'))
      .filter(file => validExtensions.indexOf(extname(file).toLowerCase()) !== -1)
      .map(file => {
        console.log(file);
        previewImages.push({
          src: `vz-${type}://${addonId}/screenshots/${file}`,
          type: 1
        });
      });
    setPreviewImages(previewImages);
  };

  useEffect(() => {
    getPreviewImages();
  }, []);

  return (
    <div className='vz-addon-card-previews-wrapper'>
      {hasScreenshotsDir && previewImages.length
        ? <div className='vz-addon-card-previews-inner' vz-count={previewImages.slice(0, 4).length}>
          <ApplicationStoreListingCarousel
            pageSize='small'
            paused='true'
            items={previewImages.slice(0, 4)}
          />
        </div>
        : <div className='vz-addon-card-previews-empty'>
          <div className='vz-addon-card-previews-empty-inner'>
            <div className='vz-addon-card-previews-empty-text'>
              No Preview Images Found
            </div>
          </div>
        </div>
      }
    </div>
  );
});
