import { getModuleByDisplayName } from '@vizality/webpack';
import { patch, unpatch } from '@vizality/patcher';

export const labels = [ 'Members' ];

export default main => {
  const MemberListItem = getModuleByDisplayName('MemberListItem');
  patch('vz-attributes-members-member', MemberListItem.prototype, 'render', function (_, res) {
    try {
      if (!res || !this?.props?.user) return;
      const { activities } = res.props?.subText?.props;
      const { user, isOwner } = this.props;
      res.props['vz-user-id'] = user.id;
      res.props['vz-activity'] = Boolean(activities?.some(activity => activity.type !== 4)) && '';
      res.props['vz-self'] = Boolean(user.email) && '';
      res.props['vz-bot'] = Boolean(user.bot) && '';
      res.props['vz-owner'] = Boolean(isOwner) && '';
    } catch (err) {
      main.error(main._labels.concat(labels.concat('Member')), err);
    }
  });
  return () => unpatch('vz-attributes-members-member');
};
