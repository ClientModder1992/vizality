import React, { memo } from 'react';

import Compact from '../displays/Compact';
import Cover from '../displays/Cover';
import List from '../displays/List';
import Card from '../displays/Card';

export default memo(props => {
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
