const findInTree = require('./findInTree');

const findInReactTree = (tree, filter) => {
  return findInTree(tree, filter, {
    walkable: [ 'props', 'children', 'child', 'sibiling' ]
  });
};

module.exports = findInReactTree;
