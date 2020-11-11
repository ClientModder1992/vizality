const { Tooltip, Icon, Clickable } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');
const { React } = require('@vizality/react');

const { open: openModal } = require('@vizality/modal');

const LicenseModal = require('../modals/License');
const licenses = require('../../licenses');

module.exports = React.memo(({ author, version, description, license, svgSize }) => {
  return (
    <div className='vizality-entity-details'>
      <div className='vizality-entity-description'>
        <Tooltip text={Messages.DESCRIPTION} position='top'>
          <Icon name='Receipt' width={svgSize} height={svgSize}/>
        </Tooltip>
        <span>{description}</span>
      </div>
      <div className='vizality-entity-metadata'>
        <div className='vizality-entity-author'>
          <Tooltip text={Messages.APPLICATION_STORE_DETAILS_DEVELOPER} position='top'>
            <Icon name='Person' width={svgSize} height={svgSize}/>
          </Tooltip>
          <span>{author}</span>
        </div>
        <div className='vizality-entity-version'>
          <Tooltip text={Messages.VIZALITY_ADDONS_VERSION} position='top'>
            <Icon name='StoreTag' width={svgSize} height={svgSize}/>
          </Tooltip>
          <span>v{version}</span>
          {(/(?:^0|-beta\d*$)/).test(version) &&
          <Tooltip text={Messages.BETA} position='top'>
            <Icon name='Experiment' width={svgSize} height={svgSize}/>
          </Tooltip>}
        </div>
        <div className='license'>
          <Tooltip text={Messages.VIZALITY_ADDONS_LICENSE} position='top'>
            <Icon name='Scale' width={svgSize} height={svgSize}/>
          </Tooltip>
          <span>{license}</span>
          {licenses[license] &&
          <Clickable onClick={() => openModal(() => <LicenseModal spdx={license} license={licenses[license]} />)}>
            <Tooltip text={Messages.LEARN_MORE} position='top'>
              <Icon name='Info' width={14} height={14}/>
            </Tooltip>
          </Clickable>}
        </div>
      </div>
    </div>
  );
});
