const { inject, uninject } = require('vizality/injector');
const { getModuleByDisplayName, getModule } = require('vizality/webpack');
const { react: { forceUpdateElement }, joinClassNames } = require('vizality/util');

module.exports = async () => {
  const MemberListItem = getModuleByDisplayName('MemberListItem');

  inject('vz-utility-classes-members', MemberListItem.prototype, 'render', function (_, retValue) {
    if (!this || !this.props || !this.props.user) return retValue;

    const { user } = this.props;

    if (user.id) retValue.props['vz-user-id'] = user.id;

    retValue.props.className = joinClassNames(
      retValue.props.className, {
        'vz-isCurrentUser': user.email,
        'vz-isBotUser': user.bot,
        'vz-isGuildOwner': this.props.isOwner
      });

    return retValue;
  });

  const MembersGroup = getModule(m => m.default && m.default.displayName === 'ListSectionItem');
  const membersGroupClasses = getModule('membersGroup').membersGroup;

  inject('vz-utility-classes-member-groups', MembersGroup, 'default', (_, retValue) => {
    if (!retValue.props ||
        !retValue.props.className ||
        !retValue.props.children ||
        !retValue.props.children.props ||
        !retValue.props.children.props.children ||
        !retValue.props.className.includes(membersGroupClasses)) {
      return retValue;
    }

    [ retValue.props['vz-role-name'] ] = retValue.props.children.props.children;
    [ , , retValue.props['vz-online-count'] ] = retValue.props.children.props.children;

    return retValue;
  });

  setImmediate(() => forceUpdateElement(`.${membersGroupClasses}`));

  return async () => {
    uninject('vz-utility-classes-members');
    uninject('vz-utility-classes-member-groups');
  };
};
