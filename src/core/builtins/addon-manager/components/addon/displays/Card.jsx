const { Icon, Tooltip, Anchor } = require('@vizality/components');
const { constants } = require('@vizality/webpack');
const { React } = require('@vizality/react');

const Description = require('../parts/Description');
const Permissions = require('../parts/Permissions');
const AddonIcon = require('../parts/Icon');
const Footer = require('../parts/Footer');

module.exports = React.memo(props => {
  const { manifest, showPreviewImages } = props;
  const authors = [].concat(manifest.author);
  const authorIds = [].concat(manifest.authorId);

  return (
    <div className='vz-addon-card-header-wrapper'>
      {showPreviewImages && <div className='vz-addon-card-preview-wrapper'>
        <div className='vz-addon-card-preview-previous'>
          <Icon
            name='LeftCaret'
            size='18px'
            className='vz-addon-card-preview-previous-icon-wrapper'
            iconClassName='vz-addon-card-preview-previous-icon'
          />
        </div>
        <div className='vz-addon-card-preview-next'>
          <Icon
            name='RightCaret'
            size='18px'
            className='vz-addon-card-preview-next-icon-wrapper'
            iconClassName='vz-addon-card-preview-next-icon'
          />
        </div>
        <div className='vz-addon-card-preview'>
          <img className='vz-addon-card-preview-img' src='https://twitchcord.com/images/preview-1.jpg' />
        </div>
      </div>}
      <div className='vz-addon-card-content-wrapper'>
        <div className='vz-addon-card-content'>
          <div className='vz-addon-card-header'>
            <AddonIcon {...props} />
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
