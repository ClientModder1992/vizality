const { react: { forceUpdateElement }, joinClassNames } = require('@util');
const { getModuleByDisplayName, getModule } = require('@webpack');
const { inject, uninject } = require('@injector');

module.exports = () => {
  const MemberListItem = getModuleByDisplayName('MemberListItem');

  inject('vz-utility-classes-members', MemberListItem.prototype, 'render', function (_, res) {
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

  inject('vz-utility-classes-member-groups', MembersGroup, 'default', (_, res) => {
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
    uninject('vz-utility-classes-members');
    uninject('vz-utility-classes-member-groups');
  };
};
