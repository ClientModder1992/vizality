const { Tooltip } = require('@vizality/components');
const { React } = require('@vizality/react');

const Description = require('../parts/Description');
const Permissions = require('../parts/Permissions');
const AddonIcon = require('../parts/Icon');
const Footer = require('../parts/Footer');
const Author = require('../parts/Author');

module.exports = React.memo(props => {
  const { manifest } = props;

  return (
    <div className='vz-addon-card-header-wrapper'>
      <div className='vz-addon-card-content-wrapper'>
        <div className='vz-addon-card-content'>
          <AddonIcon {...props} />
          <div className='vz-addon-card-header'>
            <div className='vz-addon-card-metadata'>
              <div className='vz-addon-card-name-version'>
                <div className='vz-addon-card-name'>
                  <Tooltip text={manifest.name}>
                    {manifest.name}
                  </Tooltip>
                </div>
                <span className='vz-addon-card-version'>{manifest.version}</span>
              </div>
              <Author manifest={manifest} />
            </div>
          </div>
          <Description description={manifest.description} />
          <Permissions permissions={manifest.permissions} />
          <Footer {...props} />
        </div>
      </div>
    </div>
  );
});
