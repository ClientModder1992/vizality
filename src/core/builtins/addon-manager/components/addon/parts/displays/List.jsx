const { React } = require('@vizality/react');

const Card = require('./Card');

module.exports = React.memo(props => {
  return <Card {...props} />;
});
