const { getModuleByDisplayName } = require('@vizality/webpack');
const { patch, unpatch } = require('@vizality/patcher');

module.exports = () => {
  const MemberListItem = getModuleByDisplayName('MemberListItem');

  patch('vz-attributes-channel-members-member', MemberListItem.prototype, 'render', function (_, res) {
    if (!this.props?.user) return res;
    const { user } = this.props;

    res.props['vz-user-id'] = user.id;
    res.props['vz-self'] = Boolean(user.email) && '';
    res.props['vz-bot'] = Boolean(user.bot) && '';
    res.props['vz-owner'] = Boolean(this.props?.isOwner) && '';

    return res;
  });

  return async () => unpatch('vz-attributes-channel-members-member');
};
