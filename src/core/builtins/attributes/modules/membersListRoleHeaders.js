const { react: { forceUpdateElement } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');

module.exports = () => {
  const MembersGroup = getModule(m => m.default?.displayName === 'ListSectionItem');
  const { membersGroup } = getModule('membersGroup').membersGroup;

  patch('vz-attributes-channel-members-role-headers', MembersGroup, 'default', (_, res) => {
    if (!res.props?.className.includes(membersGroup)) return res;

    [ res.props['vz-role-name'] ] = res.props?.children?.props?.children;
    [ , , res.props['vz-online-count'] ] = res.props?.children?.props?.children;

    return res;
  });

  setImmediate(() => forceUpdateElement(`.${membersGroup}`));

  return () => unpatch('vz-attributes-channel-members-role-headers');
};
