const { FormTitle, Icon } = require('@components');
const { Messages } = require('@i18n');
const { React } = require('@react');

const perms = {
  keypresses: {
    icon: ({ svgSize }) => <Icon name='Keyboard' width={svgSize} height={svgSize}/>,
    text: () => Messages.VIZALITY_ENTITIES_PERMISSIONS_KEYPRESSES
  },
  use_eud: {
    icon: ({ svgSize }) => <Icon name='PersonShield' width={svgSize} height={svgSize}/>,
    text: () => Messages.VIZALITY_ENTITIES_PERMISSIONS_USE_EUD
  },
  filesystem: {
    icon: ({ svgSize }) => <Icon name='Copy' width={svgSize} height={svgSize}/>,
    text: () => Messages.VIZALITY_ENTITIES_PERMISSIONS_FS
  },
  ext_api: {
    icon: ({ svgSize }) => <Icon name='ImportExport' width={svgSize} height={svgSize}/>,
    text: () => Messages.VIZALITY_ENTITIES_PERMISSIONS_API
  }
};

module.exports = ({ permissions, svgSize }) => (
  <div className='vizality-entity-permissions'>
    <FormTitle>{Messages.PERMISSIONS}</FormTitle>
    {Object.keys(perms).map(perm => permissions.includes(perm) &&
      <div className='item'>
        {React.createElement(perms[perm].icon, { svgSize })} {perms[perm].text()}
      </div>)}
  </div>
);
