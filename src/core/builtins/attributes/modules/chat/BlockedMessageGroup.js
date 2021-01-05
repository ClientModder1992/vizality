import { patch, unpatch } from '@vizality/patcher';
import { findInReactTree } from '@vizality/util/react';
import { getModule } from '@vizality/webpack';

export default () => {
  const BlockMessages = getModule(m => m.type?.displayName === 'BlockedMessages');

  patch('vz-attributes-blocked-messages', BlockMessages, 'type', (_, res) => {
    const props = findInReactTree(res, r => r.count);

    res.props['vz-blocked-message'] = '';
    res.props['vz-message-count'] = props?.count;
    res.props['vz-expanded'] = Boolean(props?.expanded);
    res.props['vz-collapsed'] = Boolean(!props?.expanded);

    return res;
  });

  return () => unpatch('vz-attributes-blocked-messages');
};
