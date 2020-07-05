/**
 * @deprecated:
 * @powercord: This function/module is only here to provide
 * backwards-compatability with Powercord plugins that may utilize it.
 *
 * Plugins should be using `Util.react.findInReactTree` instead.
 */

const findInTree = require('./findInTree');
const { deprecate } = require('./logger');

const findInReactTree = (tree, filter) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Util:findInReactTree';
  const REPLACEMENT_SUBMODULE = 'Util:react:findInReactTree';

  deprecate(MODULE, SUBMODULE, REPLACEMENT_SUBMODULE);

  return findInTree(tree, filter, {
    walkable: [ 'props', 'children', 'child', 'sibiling' ]
  });
};

module.exports = findInReactTree;
