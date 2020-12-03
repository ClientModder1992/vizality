const { FormTitle, Icon, Divider } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');
const { React } = require('@vizality/react');

const Permissions = {
  keypresses: {
    icon: React.memo(({ size }) => <Icon name='Keyboard' size={size} />),
    text: () => Messages.VIZALITY_ADDONS_PERMISSIONS_KEYPRESSES
  },
  use_eud: {
    icon: React.memo(({ size }) => <Icon name='PersonShield' size={size} />),
    text: () => Messages.VIZALITY_ADDONS_PERMISSIONS_USE_EUD
  },
  filesystem: {
    icon: React.memo(({ size }) => <Icon name='Copy' size={size} />),
    text: () => Messages.VIZALITY_ADDONS_PERMISSIONS_FS
  },
  ext_api: {
    icon: React.memo(({ size }) => <Icon name='ImportExport' size={size} />),
    text: () => Messages.VIZALITY_ADDONS_PERMISSIONS_API
  }
};

const Perm = React.memo(props => {
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

module.exports = React.memo(({ permissions }) => {
  const hasPermissions = permissions && permissions.length > 0;

  if (!hasPermissions) return null;

  return (
    <>
      <Divider />
      <Perm size={22} permissions={permissions} />
    </>
  );
});
