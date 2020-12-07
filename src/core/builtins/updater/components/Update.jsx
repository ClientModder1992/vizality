const { React, Router: { Link } } = require('@vizality/react');
const { Button, Tooltip } = require('@vizality/components');
const { string: { toPlural } } = require('@vizality/util');
const { getModule, constants } = require('@vizality/webpack');
const { Messages } = require('@vizality/i18n');

module.exports = React.memo(props => {
  let { manifest, addonId, id, repo, commits, updating, onSkip, onDisable, disabled, onEnableUpdates } = props;

  const type = id.split(/_(.+)/)[0].slice(0, -1);

  // If no manifest, i.e. getting a disabled update addon manifest and addonId are not sent as props
  if (!manifest) {
    [ , addonId ] = id.split(/_(.+)/);
    ({ manifest } = vizality.manager[`${type}s`].get(addonId));
  }

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
    <div className='vz-builtin-updater-update'>
      <div className='vz-builtin-updater-update-inner'>
        <div className='vz-builtin-updater-update-icon-wrapper'>
          <img
            className='vz-builtin-updater-update-icon'
            src={`vz-${type}://${addonId}/${manifest.icon}`}
          />
        </div>
        <div className='vz-builtin-updater-update-metadata'>
          <Link to={`/vizality/dashboard/${toPlural(type)}/${addonId}`} className='vz-builtin-updater-update-name'>
            {manifest.name}
          </Link>
          <div
            className='vz-builtin-updater-update-author'
            onClick={() => openProfile(manifest.authorId)}
            vz-author-id={manifest.authorId}
          >
            {manifest.author}
          </div>
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
                    <span className='vz-builtin-updater-update-summary-author'>—{commit.author}</span>
                  </div>
                );
              })}
            </div>
          }
        </div>
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
                <Button size={Button.Sizes.SMALL} color={Button.Colors.BRAND} onClick={onDisable}>
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
