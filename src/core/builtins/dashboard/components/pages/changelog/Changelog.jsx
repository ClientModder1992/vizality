const { join } = require('path');

const { Directories } = require('@vizality/constants');
const { Markdown } = require('@vizality/components');
const { React } = require('@vizality/react');

const Changelog = join(Directories.ROOT, 'CHANGELOG.md');

module.exports = React.memo(() => {
  return (
    <Markdown source={Changelog} />
  );
});
