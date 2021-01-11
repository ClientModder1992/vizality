import React, { memo } from 'react';
import { Link } from 'react-router';

import { Button, Tooltip, Anchor } from '@vizality/components';
import { toPlural } from '@vizality/util/string';
import { HTTP } from '@vizality/constants';
import { Messages } from '@vizality/i18n';

export default memo(props => {
  let { manifest, addonId, id, repo, commits, updating, onSkip, onDisable, disabled, onEnableUpdates } = props;

  const type = id.split(/_(.+)/)[0].slice(0, -1);

  // If no manifest, i.e. getting a disabled update addon manifest and addonId are not sent as props
  if (!manifest && id !== 'vizality') {
    [ , addonId ] = id.split(/_(.+)/);
    ({ manifest } = vizality.manager[`${type}s`].get(addonId));
  }

  return (
    <div className='vz-updater-update'>
      <div className='vz-updater-update-inner'>
        <div className='vz-updater-update-icon-wrapper'>
          {id === 'vizality'
            ? <img
              className='vz-updater-update-icon'
              src={'vz-asset://images/logo.png'}
            />
            : <img
              className='vz-updater-update-icon'
              src={manifest.icon}
            />
          }
        </div>
        {id === 'vizality'
          ? <div className='vz-updater-update-metadata'>
            <div className='vz-updater-update-name'>
              Vizality
            </div>
            <Anchor
              type='user'
              userId='97549189629636608'
              className='vz-updater-update-author'
            >
              dperolio
            </Anchor>
            {disabled
              ? <div className='vz-updater-update-summary' />
              : <div className='vz-updater-update-summary'>
                {commits.map(commit => {
                  return (
                    <div key={commit.id} className='vz-updater-update-summary-inner'>
                      <a
                        className='vz-updater-update-summary-commit'
                        href={`https://github.com/${repo}/commit/${commit.id}`}
                        target='_blank'
                      >
                        <Tooltip text={commit.id}>
                          <code>{commit.id.substring(0, 7)}</code>
                        </Tooltip>
                      </a>
                      <span className='vz-updater-update-summary-message'>{commit.message}</span>
                      <span className='vz-updater-update-summary-author'>—{commit.author}</span>
                    </div>
                  );
                })}
              </div>
            }
          </div>
          : <div className='vz-updater-update-metadata'>
            <Link to={`/vizality/dashboard/${toPlural(type)}/${addonId}`} className='vz-updater-update-name'>
              {manifest.name}
            </Link>
            <Anchor
              type='user'
              userId={manifest.author.id}
              className='vz-updater-update-author'
            >
              {manifest.author.name || manifest.author}
            </Anchor>
            {disabled
              ? <div className='vz-updater-update-summary'>
                <div className='vz-updater-update-description'>
                  {manifest.description}
                </div>
              </div>
              : <div className='vz-updater-update-summary'>
                {commits.map(commit => {
                  return (
                    <div key={commit.id} className='vz-updater-update-summary-inner'>
                      <a
                        className='vz-updater-update-summary-commit'
                        href={`https://github.com/${repo}/commit/${commit.id}`}
                        target='_blank'
                      >
                        <Tooltip text={commit.id}>
                          <code>{commit.id.substring(0, 7)}</code>
                        </Tooltip>
                      </a>
                      <span className='vz-updater-update-summary-message'>{commit.message}</span>
                      <span className='vz-updater-update-summary-author'>— {commit.author}</span>
                    </div>
                  );
                })}
              </div>
            }
          </div>
        }
        <div className='vz-updater-update-actions'>
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
