const { getModule } = require('vizality/webpack');
const { logger: { warn } } = require('vizality/util');

const getSections = require('./getSections');

const open = (section = 'My Account') => {
  const MODULE = 'Module';
  const SUBMODULE = 'Discord:settings:open';

  const sections = getSections();

  const { open } = getModule('open', 'updateAccount');
  const { setSection } = getModule('setSection', 'open', 'updateAccount');

  if (!sections.includes(section)) {
    warn(MODULE, SUBMODULE, null, `Section '${section}' not found. List of available user settings sections:`);
    return getSections();
  }

  return open(setSection(section));
};

module.exports = open;
