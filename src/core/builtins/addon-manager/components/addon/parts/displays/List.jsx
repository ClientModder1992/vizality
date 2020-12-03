const { React } = require('@vizality/react');

module.exports = React.memo(props => {
  return <Card {...props} />;
});
