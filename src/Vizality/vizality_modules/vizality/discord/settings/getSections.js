const { logger: { log } } = require('vizality/util');

const _getSections = require('./_getSections');

const getSections = () => {
  const MODULE = 'Module';
  const SUBMODULE = 'Discord:settings:getSections';

  const sections = _getSections();

  log(MODULE, SUBMODULE, null, 'List of available user settings sections:');
  console.log(sections);

  return sections;
};

module.exports = getSections;
