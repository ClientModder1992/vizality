const { getModule } = require('vizality/webpack');
const { logger: { warn } } = require('vizality/util');

const sections = require('./sections');

module.exports = (section = 'My Account') => {
  const MODULE = 'Module';
  const SUBMODULE = 'Discord:settings:open';

  if (!sections.includes(section)) {
    return warn(MODULE, SUBMODULE, null, `Section '${section}' not found. Please check 'settings.section' for a list of available sections.`);
  }

  return getModule([ 'open', 'updateAccount' ], false).open(
    getModule([ 'setSection', 'open', 'updateAccount' ], false).setSection(section)
  );
};
