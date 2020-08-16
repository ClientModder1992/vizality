/* eslint-disable no-unused-vars */

const getModules = require('./getModules');

const getModulesByKeyword = (keyword, exact = false) => {
  const _module = 'Module';
  const _submodule = 'Webpack:getModulesByKeyword';

  return getModules(module => {
    const modules = [ ...Object.keys(module), ...Object.keys(module.__proto__) ];

    for (const mdl of modules) {
      if (exact) {
        if (mdl === keyword) return true;
      } else {
        if (mdl.toLowerCase().indexOf(keyword.toLowerCase()) > -1) return true;
      }
    }

    return false;
  });
};

module.exports = getModulesByKeyword;
