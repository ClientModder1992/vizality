const Constants = require('@vizality/constants');
const { React } = require('@vizality/react');

const Compact = require('./displays/Compact');
const Cover = require('./displays/Cover');
const List = require('./displays/List');
const Card = require('./displays/Card');

module.exports = React.memo(props => {
  const { displayType } = props;

  return (
    <>
      {displayType === 'compact'
        ? <Compact {...props} />
        : displayType === 'cover'
          ? <Cover {...props} />
          : displayType === 'list'
            ? <List {...props} />
            : <Card {...props} />
      }
    </>
  );
});
