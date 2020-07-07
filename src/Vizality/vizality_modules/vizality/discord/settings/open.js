const { getModule } = require('vizality/webpack');
const { logger: { warn } } = require('vizality/util');

const getSections = require('./getSections');

module.exports = (section = 'My Account') => {
  const MODULE = 'Module';
  const SUBMODULE = 'Discord:settings:open';

  const sections = getSections();

  if (!sections.includes(section)) {
    warn(MODULE, SUBMODULE, null, `Section '${section}' not found. List of available user settings sections:`);
    return getSections();
  }

  return getModule('open', 'updateAccount').open(
    getModule('setSection', 'open', 'updateAccount').setSection(section)
  );
};
