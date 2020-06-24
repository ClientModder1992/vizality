const { inject, uninject } = require('vizality/injector');
const { getModuleByDisplayName, getModule } = require('vizality/webpack');
const { forceUpdateElement, classNames } = require('vizality/util');

module.exports = async () => {
  const MemberListItem = await getModuleByDisplayName('MemberListItem');

  inject('vz-utility-classes-members', MemberListItem.prototype, 'render', function (originalArgs, returnValue) {
    if (!this || !this.props || !this.props.user) return returnValue;

    const { user } = this.props;

    if (user.id) returnValue.props['vz-user-id'] = user.id;

    returnValue.props.className = classNames(
      returnValue.props.className, {
        'vz-isCurrentUser': user.email,
        'vz-isBotUser': user.bot,
        'vz-isGuildOwner': this.props.isOwner
      });

    return returnValue;
  });

  const MembersGroup = await getModule(m => m.default && m.default.displayName === 'ListSectionItem');
  const membersGroupClasses = (await getModule([ 'membersGroup' ])).membersGroup;

  inject('vz-utility-classes-member-groups', MembersGroup, 'default', (originalArgs, returnValue) => {
    if (!returnValue.props ||
        !returnValue.props.className ||
        !returnValue.props.children ||
        !returnValue.props.children.props ||
        !returnValue.props.children.props.children ||
        !returnValue.props.className.includes(membersGroupClasses)) {
      return returnValue;
    }

    [ returnValue.props['vz-role-name'] ] = returnValue.props.children.props.children;
    [ , , returnValue.props['vz-online-count'] ] = returnValue.props.children.props.children;

    return returnValue;
  });

  setImmediate(() => forceUpdateElement(`.${membersGroupClasses}`));

  return async () => {
    uninject('vz-utility-classes-members');
    uninject('vz-utility-classes-member-groups');
  };
};
