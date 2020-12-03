const { logger: { warn }, string: { toTitleCase } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');

const getSections = require('./getSections');

const open = (section = 'My Account') => {
  const _module = 'Module';
  const _submodule = 'Discord:settings:open';

  const sections = getSections();

  const { open } = getModule('open', 'updateAccount');
  const { setSection } = getModule('setSection', 'open', 'updateAccount');

  if (!sections.includes(toTitleCase(section))) {
    warn(_module, _submodule, null, `Section '${section}' not found. List of available user settings sections:`);
    return getSections();
  }

  return open(setSection(toTitleCase(section)));
};

module.exports = open;
