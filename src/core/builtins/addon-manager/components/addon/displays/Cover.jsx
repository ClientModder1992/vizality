const { Tooltip } = require('@vizality/components');
const { constants } = require('@vizality/webpack');
const { React } = require('@vizality/react');

const Description = require('../parts/Description');
const Permissions = require('../parts/Permissions');
const AddonIcon = require('../parts/Icon');
const Footer = require('../parts/Footer');

module.exports = React.memo(props => {
  const { manifest } = props;
  const authors = [].concat(manifest.author);
  const authorIds = [].concat(manifest.authorId);

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
              <div className='vz-addon-card-authors'>
                {authors.length && authors.map((author, i) =>
                  <Anchor
                    className='vz-addon-card-author'
                    vz-author-id={authorIds.length && authorIds[i] ? authorIds[i] : null}
                    href={`${window.location.origin}${constants.Endpoints.USERS}/${authorIds[i]}`}
                  >
                    {author}
                  </Anchor>)
                }
              </div>
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
