/* eslint-disable no-eval */
const { getModule, getAllModules } = require('vizality/webpack');
const { logger: { warn } } = require('vizality/util');

const { components } = require('./components');
const { layout } = require('./layout');
const { views } = require('./views');
const { plugins } = require('./plugins');
const { vizality } = require('./vizality');

module.exports = {
  classes: {
    components,
    layout,
    views,
    plugins,
    vizality
  },

  performModulesCheck () {
    const MODULE = 'Module';
    const SUBMODULE = 'Classes';

    const modules = require('./modules');

    for (const mdl in modules) {
      switch (mdl) {
        case 'getModule_array':
          return modules[mdl].forEach(e => getModule([ e ], false) || warn(MODULE, SUBMODULE, null, `Module not found: getModule([ '${e}' ])`));
        case 'getModule_function':
          return modules[mdl].forEach(e => getModule(eval(e), false) || warn(MODULE, SUBMODULE, null, `Module not found: getModule(${e})`));
        case 'getAllModules_array':
          return modules[mdl].forEach(e => getAllModules([ e ], false).length || warn(MODULE, SUBMODULE, null, `Module not found: getAllModules([ '${e}' ])`));
        case 'getAllModules_function':
          return modules[mdl].forEach(e => getAllModules(eval(e), false).length || warn(MODULE, SUBMODULE, null, `Module not found: getAllModules('${e}')`));
      }
    }
  }
};
