const { React } = require('@vizality/react');

module.exports = React.memo(({ description }) => {
  return <div className='vz-addon-card-description'>{description}</div>;
});
