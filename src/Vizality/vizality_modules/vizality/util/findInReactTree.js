/**
 * @deprecated:
 * @powercord: This function/module is only here to provide
 * backwards-compatability with Powercord plugins that may utilize it.
 *
 * Plugins should be using `react.findInReactTree` instead.
 */

const findInTree = require('./findInTree');

module.exports = (tree, filter) =>
  findInTree(tree, filter, {
    walkable: [ 'props', 'children', 'child', 'sibiling' ]
  });
