import { findInReactTree } from '@vizality/util/react';
import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export const labels = [ 'Chat' ];

export default main => {
  const BlockMessages = getModule(m => m.type?.displayName === 'BlockedMessages');
  patch('vz-attributes-blocked-messages', BlockMessages, 'type', (_, res) => {
    try {
      const props = findInReactTree(res, r => r.count);
      if (!props) return;
      res.props['vz-blocked-message'] = '';
      res.props['vz-message-count'] = props.count;
      res.props['vz-expanded'] = Boolean(props.expanded) && '';
      res.props['vz-collapsed'] = Boolean(!props.expanded) && '';
    } catch (err) {
      return main.error(main._labels.concat(labels.concat('BlockMessageGroup')), err);
    }
  });
  return () => unpatch('vz-attributes-blocked-messages');
};
