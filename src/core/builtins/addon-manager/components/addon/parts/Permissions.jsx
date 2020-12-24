import React, { memo } from 'react';

import { FormTitle, Icon, Divider } from '@vizality/components';
import { Messages } from '@vizality/i18n';

const Permissions = {
  keypresses: {
    icon: memo(({ size }) => <Icon name='Keyboard' size={size} />),
    text: () => Messages.VIZALITY_ADDONS_PERMISSIONS_KEYPRESSES
  },
  use_eud: {
    icon: memo(({ size }) => <Icon name='PersonShield' size={size} />),
    text: () => Messages.VIZALITY_ADDONS_PERMISSIONS_USE_EUD
  },
  filesystem: {
    icon: memo(({ size }) => <Icon name='Copy' size={size} />),
    text: () => Messages.VIZALITY_ADDONS_PERMISSIONS_FS
  },
  ext_api: {
    icon: memo(({ size }) => <Icon name='ImportExport' size={size} />),
    text: () => Messages.VIZALITY_ADDONS_PERMISSIONS_API
  }
};

const Perm = memo(props => {
  const { permissions, size } = props;
  return (
    <div className='vz-addon-card-permissions'>
      <FormTitle>{Messages.PERMISSIONS}</FormTitle>
      {Object.keys(Permissions).map(perm => permissions.includes(perm) &&
        <div className='vz-addon-card-permission'>
          {React.createElement(Permissions[perm].icon, { size })} {Permissions[perm].text()}
        </div>)}
    </div>
  );
});

export default memo(({ permissions }) => {
  const hasPermissions = permissions && permissions.length > 0;

  if (!hasPermissions) return null;

  return (
    <>
      <Divider />
      <Perm size={22} permissions={permissions} />
    </>
  );
});
