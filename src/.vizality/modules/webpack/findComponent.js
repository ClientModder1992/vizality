const { logger: { log, warn } } = require('@utilities');

const getModuleByDisplayName = require('./getModuleByDisplayName');
const getAllModules = require('./getAllModules');

const findComponent = (componentName, exact = false) => {
  const _module = 'Module';
  const _submodule = 'Webpack:findComponent';

  if (!componentName) {
    return warn(_module, _submodule, null, `First argument provided must be a string.`);
  }

  let byDisplayName;
  let byDefault;
  let byType;
  let results = {};

  if (exact) {
    byDisplayName = getModuleByDisplayName(componentName);
    byDefault = getAllModules(m => m.default && m.default.displayName === componentName);
    byType = getAllModules(m => m.type && m.type.displayName === componentName);
  } else {
    componentName = componentName.toLowerCase();
    byDisplayName = getAllModules(m => m.displayName && m.displayName.toLowerCase().indexOf(componentName) > 0);
    byDefault = getAllModules(m => m.default && m.default.displayName && m.default.displayName.toLowerCase().indexOf(componentName) > 0);
    byType = getAllModules(m => m.type && m.type.displayName && m.type.displayName.toLowerCase().indexOf(componentName) > 0);
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
  } else {
    let count = 0;
    let resultsText = count === 1 ? 'result' : 'results';
    
    Object.keys(results).forEach(key => count += results[key].matches.length);

    log(_module, _submodule, null, `${count} ${resultsText} found for components ${choiceWord} '${componentName}':\n`);
    
    return results;
  }
};

module.exports = findComponent;