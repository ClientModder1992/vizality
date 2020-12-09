const { react: { findInReactTree } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');

module.exports = async () => {
  const BlockMessages = getModule(m => m.type?.displayName === 'BlockedMessages');

  patch('vz-attributes-block-messages', BlockMessages, 'type', (_, res) => {
    const props = findInReactTree(res, r => r.count);

    res.props['vz-blocked-messages'] = '';
    res.props['vz-message-count'] = props?.count;
    res.props['vz-expanded'] = Boolean(props?.expanded);
    res.props['vz-collapsed'] = Boolean(!props?.expanded);

    return res;
  });

  return () => unpatch('vz-attributes-block-messages');
};
