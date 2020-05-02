const { React } = require('powercord/webpack');

// @todo: merge with Product/
module.exports = React.memo(
  ({ description }) =>
    <div className='powercord-plugin-container'>
      <div className='description'>
        <span>{description}</span>
      </div>
    </div>
);
