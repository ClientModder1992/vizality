import React, { memo } from 'react';

export default memo(props => {
  return (
    <div className='vz-addon-card-details'>
      <div className='vz-addon-card-detail-wrapper'>
        <div className='vz-addon-card-detail-label'>Rating</div>
        <div className='vz-addon-card-detail-value-wrapper'>
          <Icon
            className='vz-addon-card-detail-value-icon-wrapper vz-addon-card-rating-icon-wrapper'
            iconClassName='vz-addon-card-rating-icon'
            name='Star'
            size='14'
          />
          <div className='vz-addon-card-detail-value vz-addon-card-detail-rating-number'>5</div>
        </div>
      </div>
      <div className='vz-addon-card-detail-wrapper'>
        <div className='vz-addon-card-detail-label'>Downloads</div>
        <div className='vz-addon-card-detail-value-wrapper'>
          <Icon
            className='vz-addon-card-detail-value-icon-wrapper vz-addon-card-rating-icon-wrapper'
            iconClassName='vz-addon-card-rating-icon'
            name='Download'
            size='14'
          />
          <div className='vz-addon-card-detail-value vz-addon-card-detail-downloads-count'>123,663</div>
        </div>
      </div>
      <div className='vz-addon-card-detail-wrapper'>
        <div className='vz-addon-card-detail-label'>Last Updated</div>
        <div className='vz-addon-card-detail-value-wrapper'>
          <Icon
            className='vz-addon-card-detail-value-icon-wrapper vz-addon-card-rating-icon-wrapper'
            iconClassName='vz-addon-card-rating-icon'
            name='ClockReverse'
            size='14'
          />
          <div className='vz-addon-card-detail-value vz-addon-card-detail-updated-date'>11/26/2020</div>
        </div>
      </div>
    </div>
  );
});
