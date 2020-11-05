const { FormTitle, Icon } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');
const { React } = require('@vizality/react');

const Permissions = {
  keypresses: {
    icon: React.memo(({ svgSize }) => <Icon name='Keyboard' width={svgSize} height={svgSize}/>),
    text: () => Messages.VIZALITY_ENTITIES_PERMISSIONS_KEYPRESSES
  },
  use_eud: {
    icon: React.memo(({ svgSize }) => <Icon name='PersonShield' width={svgSize} height={svgSize}/>),
    text: () => Messages.VIZALITY_ENTITIES_PERMISSIONS_USE_EUD
  },
  filesystem: {
    icon: React.memo(({ svgSize }) => <Icon name='Copy' width={svgSize} height={svgSize}/>),
    text: () => Messages.VIZALITY_ENTITIES_PERMISSIONS_FS
  },
  ext_api: {
    icon: React.memo(({ svgSize }) => <Icon name='ImportExport' width={svgSize} height={svgSize}/>),
    text: () => Messages.VIZALITY_ENTITIES_PERMISSIONS_API
  }
};

module.exports = React.memo(({ permissions, svgSize }) => {
  return (
    <div className='vizality-entity-permissions'>
      <FormTitle>{Messages.PERMISSIONS}</FormTitle>
      {Object.keys(Permissions).map(perm => permissions.includes(perm) &&
        <div className='item'>
          {React.createElement(Permissions[perm].icon, { svgSize })} {Permissions[perm].text()}
        </div>)}
    </div>
  );
});
