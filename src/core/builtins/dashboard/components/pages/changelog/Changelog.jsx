import React, { memo } from 'react';
import { join } from 'path';

import { Directories } from '@vizality/constants';
import { Markdown } from '@vizality/components';

const Changelog = join(Directories.ROOT, 'CHANGELOG.md');

export default memo(() => {
  return (
    <Markdown source={Changelog} />
  );
});
