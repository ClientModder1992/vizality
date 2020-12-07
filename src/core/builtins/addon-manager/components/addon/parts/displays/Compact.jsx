const { React, React: { useReducer } } = require('@vizality/react');
const { Icon, Switch, Tooltip } = require('@vizality/components');
const { joinClassNames } = require('@vizality/util');
const { getModule, constants } = require('@vizality/webpack');

const AddonIcon = require('../Icon');

module.exports = React.memo(props => {
  const { manifest, isEnabled, onToggle, onUninstall } = props;
  const [ , forceUpdate ] = useReducer(x => x + 1, 0);
  const authors = [].concat(manifest.author);
  const authorIds = [].concat(manifest.authorId);
  const { colorDanger } = getModule('colorDanger');

  // @todo Use Discord module for this after it's set up.
  const openProfile = (userId) => {
    const { dirtyDispatch } = getModule('dirtyDispatch');
    const { getUser } = getModule('getUser');

    getUser(userId).then(() => dirtyDispatch({ type: constants.ActionTypes.USER_PROFILE_MODAL_OPEN, userId }))
      .catch(() => vizality.api.notices.sendToast(`open-user-profile-random-${(Math.random().toString(36) + Date.now()).substring(2, 6)}`, {
        header: 'User Not Found',
        content: `We were unable to locate that user.`,
        type: 'error'
      }));
  };

  return (
    <div className='vz-addon-card-header-wrapper'>
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
            <div className='vz-addon-card-details'>
              <div className='vz-addon-card-detail-wrapper'>
                <div className='vz-addon-card-detail-label'>Rating</div>
                <div className='vz-addon-card-detail-value-wrapper'>
                  <Icon
                    className='vz-addon-card-detail-value-icon-wrapper vz-addon-card-rating-icon-wrapper'
                    iconClassName='vz-addon-card-rating-icon'
                    name='Star'
                    size='14'
                  />
                  <div className='vz-addon-card-detail-value vz-addon-card-detail-rating-number'>5</div>
                </div>
              </div>
              <div className='vz-addon-card-detail-wrapper'>
                <div className='vz-addon-card-detail-label'>Downloads</div>
                <div className='vz-addon-card-detail-value-wrapper'>
                  <Icon
                    className='vz-addon-card-detail-value-icon-wrapper vz-addon-card-rating-icon-wrapper'
                    iconClassName='vz-addon-card-rating-icon'
                    name='Download'
                    size='14'
                  />
                  <div className='vz-addon-card-detail-value vz-addon-card-detail-downloads-count'>123,663</div>
                </div>
              </div>
              <div className='vz-addon-card-detail-wrapper'>
                <div className='vz-addon-card-detail-label'>Last Updated</div>
                <div className='vz-addon-card-detail-value-wrapper'>
                  <Icon
                    className='vz-addon-card-detail-value-icon-wrapper vz-addon-card-rating-icon-wrapper'
                    iconClassName='vz-addon-card-rating-icon'
                    name='ClockReverse'
                    size='14'
                  />
                  <div className='vz-addon-card-detail-value vz-addon-card-detail-updated-date'>11/26/2020</div>
                </div>
              </div>
            </div>
            <div className='vz-addon-card-actions'>
              {onUninstall &&
                <div className={joinClassNames('vz-addon-card-uninstall', colorDanger)}>
                  <Icon
                    className='vz-addon-card-uninstall-button-wrapper'
                    iconClassName='vz-addon-card-uninstall-button'
                    name='Trash'
                    tooltip='Uninstall'
                    onClick={e => {
                      e.stopPropagation();
                      onUninstall();
                    }}
                  />
                </div>
              }
              <div className='vz-addon-card-settings'>
                <Icon
                  className='vz-addon-card-settings-button-wrapper'
                  iconClassName='vz-addon-card-settings-button'
                  name='Gear'
                  tooltip='Settings'
                  onClick={() => void 0}
                />
              </div>
              <div className='vz-addon-card-toggle-wrapper'>
                <Switch
                  className='vz-addon-card-toggle'
                  value={isEnabled}
                  onChange={v => {
                    onToggle(v.target.checked);
                    forceUpdate();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
