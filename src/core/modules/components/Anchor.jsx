const { string: { toPlural }, joinClassNames } = require('@vizality/util');
const { React, React: { memo } } = require('@vizality/react');
const { getModule, constants } = require('@vizality/webpack');

const AsyncComponent = require('./AsyncComponent');

const DAnchor = AsyncComponent.fromDisplayName('Anchor');

module.exports = memo(props => {
  const { className, userId, children, type, addonId } = props;

  return (
    <>
      {!type
        ? <DAnchor {...props}>
          {children}
        </DAnchor>
        : type === 'user'
          ? <DAnchor
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
          </DAnchor>
          : type === 'plugin' || type === 'theme'
            ? <DAnchor
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
            </DAnchor>
            : null
      }
    </>
  );
});
