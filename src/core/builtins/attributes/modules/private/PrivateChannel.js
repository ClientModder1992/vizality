import { getModuleByDisplayName } from '@vizality/webpack';
import { patch, unpatch } from '@vizality/patcher';

export default () => {
  const PrivateChannel = getModuleByDisplayName('PrivateChannel');

  patch('vz-attributes-private-channels-list-channel', PrivateChannel.prototype, 'render', function (_, res) {
    const { user, status, muted, activities } = this.props;

    res.props['vz-activity'] = Boolean(activities?.length) && '';
    res.props['vz-group-channel'] = Boolean(!user?.id) && '';
    res.props['vz-system'] = Boolean(user?.system) && '';
    res.props['vz-user-channel'] = Boolean(user) && '';
    res.props['vz-self'] = Boolean(user?.email) && '';
    res.props['vz-bot'] = Boolean(user?.bot) && '';
    res.props['vz-muted'] = Boolean(muted) && '';
    res.props['vz-user-id'] = user?.id;
    res.props['vz-status'] = status;

    return res;
  });

  return () => unpatch('vz-attributes-private-channels-list-channel');
};
