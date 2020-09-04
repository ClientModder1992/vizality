const { Tooltip, Icon } = require('@components');
const { Messages } = require('@i18n');
const { React } = require('@react');

const Details = React.memo(
  ({ author, version, description, svgSize }) => (
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
          <Tooltip text={Messages.VIZALITY_ENTITIES_VERSION} position='top'>
            <Icon name='StoreTag' width={svgSize} height={svgSize}/>
          </Tooltip>
          <span>v{version}</span>
          {(/(?:^0|-beta\d*$)/).test(version) &&
          <Tooltip text={Messages.BETA} position='top'>
            <Icon name='Experiment' width={svgSize} height={svgSize}/>
          </Tooltip>}
        </div>
      </div>
    </div>
  )
);

module.exports = Details;
