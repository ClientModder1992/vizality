/* eslint-disable no-unused-vars */

const { inject, uninject } = require('vizality/injector');
const { getModuleByDisplayName, getModule } = require('vizality/webpack');
const { joinClassNames, react: { findInReactTree }, string: { toCamelCase } } = require('vizality/util');

/*
 * Modifies The TransitionGroup component. We are checking for and modifying
 * settings content sections in particular, adding utility helper classes.
 */

module.exports = async () => {
  const TransitionGroup = getModuleByDisplayName('TransitionGroup');
  const { contentRegion } = getModule('contentRegion');

  inject('vz-utility-classes-transitionGroup', TransitionGroup.prototype, 'render', (_, retValue) => {
    if (!retValue.props ||
        retValue.props.className !== contentRegion ||
        !retValue.props.className.includes(contentRegion)) {
      return retValue;
    }

    const { section } = findInReactTree(retValue, c => c.section);

    retValue.props.className = joinClassNames(retValue.props.className, { [`vz-${toCamelCase(section)}Section`]: section });

    return retValue;
  });

  return () => uninject('vz-utility-classes-transitionGroup');
};
