const { React, React: { useState } } = require('@vizality/react');
const { Tooltip, Spinner } = require('@vizality/components');
const { joinClassNames } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');
const Constants = require('@vizality/constants');

const Description = require('../Description');
const Permissions = require('../Permissions');
const AddonIcon = require('../Icon');
const Footer = require('../Footer');

module.exports = React.memo(props => {
  const { manifest, type, addonId, randomAvatar } = props;
  const [ iconLoading, setIconLoading ] = useState(true);
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
                  <div
                    className='vz-addon-card-author'
                    vz-author-id={authorIds.length && authorIds[i] ? authorIds[i] : null}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!authorIds.length || !authorIds[i]) return;
                      // @todo This doesn't work, fix it.
                      return Promise.all(getModule('getUser').getUser(authorIds[i]))
                        .then(() => getModule('open', 'fetchProfile').open(authorIds[i]))
                        .catch(() => vizality.api.notices.sendToast(`some-random-${(Math.random().toString(36) + Date.now()).substring(2, 6)}`, {
                          header: 'User Not Found',
                          content: `We were unable to locate that user.`,
                          type: 'error'
                        }));
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
