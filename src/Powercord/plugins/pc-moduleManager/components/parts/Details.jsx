const { React } = require('powercord/webpack');

module.exports = React.memo(
  ({ description }) => (
    <div className='powercord-product-details'>
      <div className='description'>
        <span>{description}</span>
      </div>
    </div>
  )
);
