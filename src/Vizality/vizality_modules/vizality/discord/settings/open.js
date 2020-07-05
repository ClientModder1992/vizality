const { getModule } = require('vizality/webpack');
const { logger: { warn } } = require('vizality/util');

const _getSections = require('./_getSections');

module.exports = (section = 'My Account') => {
  const MODULE = 'Module';
  const SUBMODULE = 'Discord:settings:open';

  const sections = _getSections();

  if (!sections.includes(section)) {
    warn(MODULE, SUBMODULE, null, `Section '${section}' not found. List of available user settings sections:`);
    return console.warn(sections);
  }

  return getModule([ 'open', 'updateAccount' ], false).open(
    getModule([ 'setSection', 'open', 'updateAccount' ], false).setSection(section)
  );
};
