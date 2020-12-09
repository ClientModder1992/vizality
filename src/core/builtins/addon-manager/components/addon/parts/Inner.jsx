const { React } = require('@vizality/react');

const Compact = require('../displays/Compact');
const Cover = require('../displays/Cover');
const List = require('../displays/List');
const Card = require('../displays/Card');

module.exports = React.memo(props => {
  const { display } = props;

  return (
    <>
      {display === 'compact'
        ? <Compact {...props} />
        : display === 'cover'
          ? <Cover {...props} />
          : display === 'list'
            ? <List {...props} />
            : <Card {...props} />
      }
    </>
  );
});
