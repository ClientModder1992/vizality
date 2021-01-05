import React, { memo } from 'react';

import { getModule, constants } from '@vizality/webpack';
import { joinClassNames } from '@vizality/util/dom';
import { toPlural } from '@vizality/util/string';

import AsyncComponent from './AsyncComponent';

const Anchor = AsyncComponent.fromDisplayName('Anchor');

export default memo(props => {
  const { className, userId, children, type, addonId } = props;

  return (
    <>
      {!type
        ? <Anchor {...props}>
          {children}
        </Anchor>
        : type === 'user'
          ? <Anchor
            className={joinClassNames('vz-user-anchor', className)}
            vz-user-id={userId || null}
            href={userId && `${window.location.origin}${constants.Endpoints.USERS}/${userId}`}
            onClick={e => {
              e.preventDefault();
              if (!userId) return;
              // @todo Use Discord module for this after it's set up.
              getModule('getUser').getUser(userId)
                .then(() => getModule('open', 'fetchProfile').open(userId))
                .catch(() => vizality.api.notices.sendToast(`open-user-profile-${(Math.random().toString(36) + Date.now()).substring(2, 6)}`, {
                  header: 'User Not Found',
                  type: 'User Not Found',
                  content: 'That user was unable to be located.',
                  icon: 'PersonRemove'
                }));
            }}
          >
            {children}
          </Anchor>
          : type === 'plugin' || type === 'theme'
            ? <Anchor
              className={joinClassNames('vz-addon-anchor', className)}
              vz-addon-id={addonId || null}
              onClick={e => {
                e.preventDefault();
                // @todo Use Discord module for this after it's set up.
                if (!addonId) return;
                vizality.api.router.navigate(`/vizality/dashboard/${toPlural(type)}/${addonId}`);
              }}
            >
              {children}
            </Anchor>
            : null
      }
    </>
  );
});
