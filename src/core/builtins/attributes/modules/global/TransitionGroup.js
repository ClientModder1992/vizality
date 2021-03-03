/*
 * Modifies The TransitionGroup component. We are checking for and modifying
 * settings content sections in particular, adding high level specificity utility
 * helper classes.
 */

import { getModuleByDisplayName, getModule } from '@vizality/webpack';
import { findInReactTree } from '@vizality/util/react';
import { toKebabCase } from '@vizality/util/string';
import { patch, unpatch } from '@vizality/patcher';

export const labels = [ 'Global' ];

export default main => {
  const TransitionGroup = getModuleByDisplayName('TransitionGroup');
  const { contentRegion } = getModule('contentRegion');
  patch('vz-attributes-transition-group', TransitionGroup?.prototype, 'render', (_, res) => {
    try {
      if (!res.props?.className?.includes(contentRegion)) return;
      const section = findInReactTree(res, c => c.section)?.section;
      section && (res.props['vz-section'] = toKebabCase(section));
    } catch (err) {
      return main.error(main._labels.concat(labels.concat('TransitionGroup')), err);
    }
  });
  return () => unpatch('vz-attributes-transition-group');
};
