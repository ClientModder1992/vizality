const { logger: { log, warn } } = require('@utilities');

const getModuleByDisplayName = require('./getModuleByDisplayName');
const getModules = require('./getModules');

const findComponent = (componentName, exact = false) => {
  const _module = 'Module';
  const _submodule = 'Webpack:findComponent';

  if (!componentName) {
    return warn(_module, _submodule, null, `First argument provided must be a string.`);
  }

  let byDisplayName;
  let byDefault;
  let byType;

  const results = {};

  if (exact) {
    byDisplayName = getModuleByDisplayName(componentName);
    byDefault = getModules(m => m.default && m.default.displayName === componentName);
    byType = getModules(m => m.type && m.type.displayName === componentName);
  } else {
    componentName = componentName.toLowerCase();
    byDisplayName = getModules(m => m.displayName && m.displayName.toLowerCase().indexOf(componentName) > -1);
    byDefault = getModules(m => m.default && m.default.displayName && m.default.displayName.toLowerCase().indexOf(componentName) > -1);
    byType = getModules(m => m.type && m.type.displayName && m.type.displayName.toLowerCase().indexOf(componentName) > -1);
  }

  if (byDisplayName && byDisplayName.length) {
    Object.assign(results, {
      displayName: {
        matches: byDisplayName
      }
    });
  }

  if (byDefault && byDefault.length) {
    Object.assign(results, {
      default: {
        matches: byDefault
      }
    });
  }

  if (byType && byType.length) {
    Object.assign(results, {
      type: {
        matches: byType
      }
    });
  }

  const choiceWord = exact ? 'matching' : 'containing';

  if (!results || !Object.keys(results).length) {
    return warn(_module, _submodule, null, `No results found for components ${choiceWord} '${componentName}'`);
  }

  let count = 0;
  const resultsText = count === 1 ? 'result' : 'results';

  Object.keys(results).forEach(key => count += results[key].matches.length);

  log(_module, _submodule, null, `${count} ${resultsText} found for components ${choiceWord} '${componentName}':\n`);

  return results;
};

module.exports = findComponent;