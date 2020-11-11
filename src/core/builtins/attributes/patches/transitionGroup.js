const { joinClassNames, react: { findInReactTree }, string: { toCamelCase } } = require('@vizality/util');
const { getModuleByDisplayName, getModule } = require('@vizality/webpack');
const { patch, unpatch } = require('@vizality/patcher');

/*
 * Modifies The TransitionGroup component. We are checking for and modifying
 * settings content sections in particular, adding utility helper classes.
 */

module.exports = async () => {
  const TransitionGroup = getModuleByDisplayName('TransitionGroup');
  const { contentRegion } = getModule('contentRegion');

  patch('vz-attributes-transitionGroup', TransitionGroup.prototype, 'render', (_, res) => {
    if (!res.props || res.props.className !== contentRegion || !res.props.className.includes(contentRegion)) {
      return res;
    }

    const { section } = findInReactTree(res, c => c.section);

    res.props.className = joinClassNames(res.props.className, { [`vz-${toCamelCase(section)}Section`]: section });

    return res;
  });

  return () => unpatch('vz-attributes-transitionGroup');
};
