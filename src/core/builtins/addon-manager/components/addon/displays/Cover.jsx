const { React } = require('@vizality/react');
const { Tooltip } = require('@vizality/components');
const { getModule, constants } = require('@vizality/webpack');

const Description = require('../parts/Description');
const Permissions = require('../parts/Permissions');
const AddonIcon = require('../parts/Icon');
const Footer = require('../parts/Footer');

module.exports = React.memo(props => {
  const { manifest } = props;
  const authors = [].concat(manifest.author);
  const authorIds = [].concat(manifest.authorId);

  // @todo Use Discord module for this after it's set up.
  const openProfile = (userId) => {
    getModule('getUser').getUser(userId)
      .then(() => getModule('open', 'fetchProfile').open(userId))
      .catch(() => vizality.api.notices.sendToast(`open-user-profile-random-${(Math.random().toString(36) + Date.now()).substring(2, 6)}`, {
        header: 'User Not Found',
        type: 'User Not Found',
        content: 'That user was unable to be located.',
        icon: 'PersonRemove'
      }));
  };

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
                  <div
                    className='vz-addon-card-author'
                    vz-author-id={authorIds.length && authorIds[i] ? authorIds[i] : null}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!authorIds.length || !authorIds[i]) return;
                      openProfile(authorIds[i]);
                    }}
                  >
                    {author}
                  </div>)
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
