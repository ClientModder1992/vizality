const { Clickable, Tooltip, Icons: { Receipt, Person, Tag, Chemistry, Scale, Info } } = require('@components');
const { React, i18n: { Messages } } = require('@webpack');
const { open: openModal } = require('vizality/modal');

const LicenseModal = require('../modals/License');
const licenses = require('../../licenses');

const Details = React.memo(
  ({ author, version, description, license, svgSize }) => (
    <div className='vizality-entity-details'>
      <div className='vizality-entity-description'>
        <Tooltip text={Messages.DESCRIPTION} position='top'>
          <Receipt width={svgSize} height={svgSize}/>
        </Tooltip>
        <span>{description}</span>
      </div>
      <div className='vizality-entity-metadata'>
        <div className='vizality-entity-author'>
          <Tooltip text={Messages.APPLICATION_STORE_DETAILS_DEVELOPER} position='top'>
            <Person width={svgSize} height={svgSize}/>
          </Tooltip>
          <span>{author}</span>
        </div>
        <div className='vizality-entity-version'>
          <Tooltip text={Messages.VIZALITY_ENTITIES_VERSION} position='top'>
            <Tag width={svgSize} height={svgSize}/>
          </Tooltip>
          <span>v{version}</span>
          {(/(?:^0|-beta\d*$)/).test(version) &&
          <Tooltip text={Messages.BETA} position='top'>
            <Chemistry width={18} height={18}/>
          </Tooltip>}
        </div>
        <div className='vizality-entity-license'>
          <Tooltip text={Messages.VIZALITY_ENTITIES_LICENSE} position='top'>
            <Scale width={svgSize} height={svgSize}/>
          </Tooltip>
          <span>{license}</span>
          {licenses[license] &&
          <Clickable onClick={() => openModal(() => <LicenseModal spdx={license} license={licenses[license]}/>)}>
            <Tooltip text={Messages.LEARN_MORE} position='top'>
              <Info width={14} height={14}/>
            </Tooltip>
          </Clickable>}
        </div>
      </div>
    </div>
  )
);

module.exports = Details;
