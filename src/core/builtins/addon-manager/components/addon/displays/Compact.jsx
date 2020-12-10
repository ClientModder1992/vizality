const { Icon, Switch, Tooltip, Anchor } = require('@vizality/components');
const { React, React: { useReducer } } = require('@vizality/react');
const { getModule, constants } = require('@vizality/webpack');
const { joinClassNames } = require('@vizality/util');

const AddonIcon = require('../parts/Icon');

module.exports = React.memo(props => {
  const { manifest, isEnabled, onToggle, onUninstall } = props;
  const [ , forceUpdate ] = useReducer(x => x + 1, 0);
  const authors = [].concat(manifest.author);
  const authorIds = [].concat(manifest.authorId);
  const { colorDanger } = getModule('colorDanger');

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
                  <Anchor
                    className='vz-addon-card-author'
                    vz-author-id={authorIds.length && authorIds[i] ? authorIds[i] : null}
                    href={`${window.location.origin}${constants.Endpoints.USERS}/${authorIds[i]}`}
                    onClick={e => e.stopPropagation()}
                  >
                    {author}
                  </Anchor>)
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
