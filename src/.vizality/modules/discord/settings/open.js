const { getModule } = require('@webpack');
const { logger: { warn } } = require('@util');

const getSections = require('./getSections');

const open = (section = 'My Account') => {
  const module = 'Module';
  const submodule = 'Discord:settings:open';

  const sections = getSections();

  const { open } = getModule('open', 'updateAccount');
  const { setSection } = getModule('setSection', 'open', 'updateAccount');

  if (!sections.includes(section)) {
    warn(module, submodule, null, `Section '${section}' not found. List of available user settings sections:`);
    return getSections();
  }

  return open(setSection(section));
};

module.exports = open;
