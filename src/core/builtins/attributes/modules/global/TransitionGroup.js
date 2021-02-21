import { getModuleByDisplayName, getModule } from '@vizality/webpack';
import { findInReactTree } from '@vizality/util/react';
import { toKebabCase } from '@vizality/util/string';
import { patch, unpatch } from '@vizality/patcher';

/*
 * Modifies The TransitionGroup component. We are checking for and modifying
 * settings content sections in particular, adding high level specificity utility
 * helper classes.
 */
export default () => {
  const TransitionGroup = getModuleByDisplayName('TransitionGroup');
  const { contentRegion } = getModule('contentRegion');

  patch('vz-attributes-transition-group', TransitionGroup.prototype, 'render', (_, res) => {
    if (!res.props?.className?.includes(contentRegion)) return res;

    const { section } = findInReactTree(res, c => c.section);

    res.props['vz-section'] = toKebabCase(section);

    return res;
  });

  return () => unpatch('vz-attributes-transition-group');
};
