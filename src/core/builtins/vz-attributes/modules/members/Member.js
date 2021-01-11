import { getModuleByDisplayName } from '@vizality/webpack';
import { patch, unpatch } from '@vizality/patcher';

export default () => {
  const MemberListItem = getModuleByDisplayName('MemberListItem');

  patch('vz-attributes-members-member', MemberListItem.prototype, 'render', function (_, res) {
    if (!this.props?.user) return res;

    const { activities } = res.props?.subText?.props;
    const { user, isOwner } = this.props;

    res.props['vz-user-id'] = user?.id;
    res.props['vz-activities'] = Boolean(activities.some(activity => activity.type !== 4)) && '';
    res.props['vz-self'] = Boolean(user?.email) && '';
    res.props['vz-bot'] = Boolean(user?.bot) && '';
    res.props['vz-owner'] = Boolean(isOwner) && '';

    return res;
  });

  return () => unpatch('vz-attributes-members-member');
};
