const { react: { forceUpdateElement }, joinClassNames } = require('@vizality/util');
const { getModuleByDisplayName, getModule } = require('@vizality/webpack');
const { patch, unpatch } = require('@vizality/patcher');

module.exports = () => {
  const MemberListItem = getModuleByDisplayName('MemberListItem');

  patch('vz-attributes-members', MemberListItem.prototype, 'render', function (_, res) {
    if (!this || !this.props || !this.props.user) return res;

    const { user } = this.props;

    if (user.id) res.props['vz-user-id'] = user.id;

    res.props.className = joinClassNames(
      res.props.className, {
        'vz-isCurrentUser': user.email,
        'vz-isBotUser': user.bot,
        'vz-isGuildOwner': this.props.isOwner
      });

    return res;
  });

  const MembersGroup = getModule(m => m.default && m.default.displayName === 'ListSectionItem');
  const membersGroupClasses = getModule('membersGroup').membersGroup;

  patch('vz-attributes-member-groups', MembersGroup, 'default', (_, res) => {
    if (!res.props ||
        !res.props.className ||
        !res.props.children ||
        !res.props.children.props ||
        !res.props.children.props.children ||
        !res.props.className.includes(membersGroupClasses)) {
      return res;
    }

    [ res.props['vz-role-name'] ] = res.props.children.props.children;
    [ , , res.props['vz-online-count'] ] = res.props.children.props.children;

    return res;
  });

  setImmediate(() => forceUpdateElement(`.${membersGroupClasses}`));

  return async () => {
    unpatch('vz-attributes-members');
    unpatch('vz-attributes-member-groups');
  };
};
