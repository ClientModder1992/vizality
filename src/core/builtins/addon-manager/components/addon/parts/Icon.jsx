const { React, React: { useState } } = require('@vizality/react');
const { array: { getRandomArrayItem }, joinClassNames } = require('@vizality/util');
const { Spinner } = require('@vizality/components');
const Constants = require('@vizality/constants');

module.exports = React.memo(props => {
  const { manifest, type, addonId } = props;
  const [ iconLoading, setIconLoading ] = useState(true);

  const defaultAvatars = [
    Constants.Avatars[`DEFAULT_${type.toUpperCase()}_1`],
    Constants.Avatars[`DEFAULT_${type.toUpperCase()}_2`],
    Constants.Avatars[`DEFAULT_${type.toUpperCase()}_3`],
    Constants.Avatars[`DEFAULT_${type.toUpperCase()}_4`],
    Constants.Avatars[`DEFAULT_${type.toUpperCase()}_5`]
  ];

  const randomAvatar = getRandomArrayItem(defaultAvatars);

  return (
    <div className='vz-addon-card-icon'>
      {iconLoading && <Spinner
        className='vz-addon-card-icon-spinner'
        type={Spinner.Type.SPINNER_CIRCLE}
      />}
      <img
        className={joinClassNames('vz-addon-card-icon-img', { iconLoading: 'vz-img-loading' })}
        src={manifest.icon ? `vz-${type}://${addonId}/${manifest.icon}` : randomAvatar}
        onError={e => {
          e.target.onerror = null;
          e.target.src = Constants.Avatars.ERROR;
        }}
        onLoad={() => setIconLoading(false)}
      />
    </div>
  );
});
