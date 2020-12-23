import React, { memo } from 'react';

import { getModule, constants } from '@vizality/webpack';
import { toPlural } from '@vizality/util/string';
import { joinClassNames } from '@vizality/util';

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
              // @todo Use Discord module for this after it's set up.
              if (!userId) return;
              getModule('open', 'fetchProfile').open(userId);
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
