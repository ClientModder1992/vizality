const { LazyImage } = require('@vizality/components');
const { React } = require('@vizality/react');

module.exports = React.memo(props => {
  const { manifest } = props;

  return (
    <div className='vz-addon-card-icon'>
      <LazyImage
        className='vz-addon-card-icon-image-wrapper'
        imageClassName='vz-addon-card-icon-img'
        src={manifest.icon}
      />
    </div>
  );
});
