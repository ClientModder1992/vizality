const { sleep } = require('@utilities');

const moduleFilters = require('./modules');
const Webpack = require('../webpack');
const _getModule = require('./_getModule');

/**
 * Initializes the injection into Webpack.
 * @returns {Promise<void>}
 */
const _init = async () => {
  // Wait until webpack is ready
  while (!window.webpackJsonp) {
    await sleep(1);
  }

  // Extract values from webpack
  const moduleID = Math.random.toString();
  const instance = webpackJsonp.push([
    [],
    {
      [moduleID]: (_, e, r) => {
        e.cache = r.c;
        e.require = r;
      }
    },
    [ [ moduleID ] ]
  ]);
  delete instance.cache[moduleID];
  Webpack.instance = instance;

  // Load modules pre-fetched
  for (const mdl in moduleFilters) {
    Webpack[mdl] = await _getModule(moduleFilters[mdl], true);
  }
};

module.exports = _init;
