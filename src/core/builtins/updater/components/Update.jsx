const { React, Router: { Link } } = require('@vizality/react');
const { Button, Tooltip, Anchor } = require('@vizality/components');
const { string: { toPlural } } = require('@vizality/util');
const { constants } = require('@vizality/webpack');
const { HTTP } = require('@vizality/constants');
const { Messages } = require('@vizality/i18n');

module.exports = React.memo(props => {
  let { manifest, addonId, id, repo, commits, updating, onSkip, onDisable, disabled, onEnableUpdates } = props;

  const type = id.split(/_(.+)/)[0].slice(0, -1);

  // If no manifest, i.e. getting a disabled update addon manifest and addonId are not sent as props
  if (!manifest && id !== 'vizality') {
    [ , addonId ] = id.split(/_(.+)/);
    ({ manifest } = vizality.manager[`${type}s`].get(addonId));
  }

  return (
    <div className='vz-builtin-updater-update'>
      <div className='vz-builtin-updater-update-inner'>
        <div className='vz-builtin-updater-update-icon-wrapper'>
          {id === 'vizality'
            ? <img
              className='vz-builtin-updater-update-icon'
              src={`${HTTP.IMAGES}/logo.png`}
            />
            : <img
              className='vz-builtin-updater-update-icon'
              src={manifest.icon}
            />
          }
        </div>
        {id === 'vizality'
          ? <div className='vz-builtin-updater-update-metadata'>
            <div className='vz-builtin-updater-update-name'>
              Vizality
            </div>
            <Anchor
              className='vz-builtin-updater-update-author'
              vz-author-id='97549189629636608'
              href={`${window.location.origin}${constants.Endpoints.USERS}/97549189629636608`}
            >
              dperolio
            </Anchor>
            {disabled
              ? <div className='vz-builtin-updater-update-summary' />
              : <div className='vz-builtin-updater-update-summary'>
                {commits.map(commit => {
                  return (
                    <div key={commit.id} className='vz-builtin-updater-update-summary-inner'>
                      <a
                        className='vz-builtin-updater-update-summary-commit'
                        href={`https://github.com/${repo}/commit/${commit.id}`}
                        target='_blank'
                      >
                        <Tooltip text={commit.id}>
                          <code>{commit.id.substring(0, 7)}</code>
                        </Tooltip>
                      </a>
                      <span className='vz-builtin-updater-update-summary-message'>{commit.message}</span>
                      <span className='vz-builtin-updater-update-summary-author'>—{commit.author}</span>
                    </div>
                  );
                })}
              </div>
            }
          </div>
          : <div className='vz-builtin-updater-update-metadata'>
            <Link to={`/vizality/dashboard/${toPlural(type)}/${addonId}`} className='vz-builtin-updater-update-name'>
              {manifest.name}
            </Link>
            <Anchor
              className='vz-builtin-updater-update-author'
              vz-author-id={manifest.authorId}
              href={`${window.location.origin}${constants.Endpoints.USERS}/${manifest.authorId}`}
            >
              {manifest.authorId}
            </Anchor>
            {disabled
              ? <div className='vz-builtin-updater-update-summary'>
                <div className='vz-builtin-updater-update-description'>
                  {manifest.description}
                </div>
              </div>
              : <div className='vz-builtin-updater-update-summary'>
                {commits.map(commit => {
                  return (
                    <div key={commit.id} className='vz-builtin-updater-update-summary-inner'>
                      <a
                        className='vz-builtin-updater-update-summary-commit'
                        href={`https://github.com/${repo}/commit/${commit.id}`}
                        target='_blank'
                      >
                        <Tooltip text={commit.id}>
                          <code>{commit.id.substring(0, 7)}</code>
                        </Tooltip>
                      </a>
                      <span className='vz-builtin-updater-update-summary-message'>{commit.message}</span>
                      <span className='vz-builtin-updater-update-summary-author'>— {commit.author}</span>
                    </div>
                  );
                })}
              </div>
            }
          </div>
        }
        <div className='vz-builtin-updater-update-actions'>
          {disabled
            ? <Button size={Button.Sizes.SMALL} color={Button.Colors.GREEN} onClick={onEnableUpdates}>
              {Messages.VIZALITY_UPDATES_ENABLE}
            </Button>
            : updating
              ? <Button size={Button.Sizes.SMALL} color={Button.Colors.GREEN} disabled>
                {Messages.VIZALITY_UPDATES_UPDATING_ITEM}
              </Button>
              : <>
                <Button size={Button.Sizes.SMALL} color={Button.Colors.RED} onClick={onDisable}>
                  {Messages.VIZALITY_UPDATES_DISABLE}
                </Button>
                <Button size={Button.Sizes.SMALL} color={Button.Colors.GREY} onClick={onSkip}>
                  {Messages.VIZALITY_UPDATES_SKIP}
                </Button>
              </>
          }
        </div>
      </div>
    </div>
  );
});
