const { getModuleByDisplayName } = require('@vizality/webpack');
const { patch, unpatch } = require('@vizality/patcher');

module.exports = async () => {
  const PrivateChannel = await getModuleByDisplayName('PrivateChannel', true);

  patch('vz-attributes-private-channels-list-channel', PrivateChannel.prototype, 'render', function (_, res) {
    res.props['vz-user-id'] = this.props?.user?.id;
    res.props['vz-status'] = this.props?.status;
    res.props['vz-user-channel'] = Boolean(this.props?.user) && '';
    res.props['vz-group-channel'] = Boolean(!this.props?.user?.id) && '';
    res.props['vz-bot'] = Boolean(this.props?.user?.bot) && '';
    res.props['vz-system'] = Boolean(this.props?.user?.system) && '';
    res.props['vz-self'] = Boolean(this.props?.user?.email) && '';
    res.props['vz-muted'] = Boolean(this.props?.muted) && '';
    res.props['vz-activity'] = Boolean(this.props?.activities?.length) && '';

    return res;
  });

  return () => unpatch('vz-attributes-private-channels-list-channel');
};
