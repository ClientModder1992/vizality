import { forceUpdateElement } from '@vizality/util/react';
import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export default () => {
  const MembersGroup = getModule(m => m.default?.displayName === 'ListSectionItem');
  const { membersGroup } = getModule('membersGroup');

  patch('vz-attributes-members-role-headers', MembersGroup, 'default', (_, res) => {
    if (!res.props?.className.includes(membersGroup)) return res;

    [ res.props['vz-role-name'] ] = res.props?.children?.props?.children;
    [ , , res.props['vz-online-count'] ] = res.props?.children?.props?.children;

    return res;
  });

  setImmediate(() => forceUpdateElement(`.${membersGroup}`));

  return () => unpatch('vz-attributes-members-role-headers');
};
