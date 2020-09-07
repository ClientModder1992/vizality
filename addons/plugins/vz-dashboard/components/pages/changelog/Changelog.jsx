const { join } = require('path');

const { Directories } = require('@constants');
const { Markdown } = require('@components');
const { React } = require('@react');

const Changelog = join(Directories.ROOT, 'CHANGELOG.md');

module.exports = React.memo(() => {
  return <Markdown source={Changelog} />;
});
