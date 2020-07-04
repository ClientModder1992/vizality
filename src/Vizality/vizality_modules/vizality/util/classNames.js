/**
 * @hack: Figure out why const { getModule } = require('vizality/webpack') doesn't work.
 */
let classNames;

module.exports = (...args) => {
  if (!classNames) {
    classNames = require('vizality/webpack').getModule(e => e.default && e.default.default, false);
  }
  return classNames(...args);
};
