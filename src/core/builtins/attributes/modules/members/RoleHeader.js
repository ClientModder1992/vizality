import { forceUpdateElement } from '@vizality/util/react';
import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export const labels = [ 'Members' ];

export default main => {
  const ListSectionItem = getModule(m => m.default?.displayName === 'ListSectionItem');
  const { membersGroup } = getModule('membersGroup');
  patch('vz-attributes-members-role-headers', ListSectionItem, 'default', (_, res) => {
    try {
      /*
       * ListSectionItem is used for more than just channel member role headers, so let's make sure
       * we're targetting just the channel member role headers here.
       */
      if (!res.props?.children?.props || !res.props?.className?.includes(membersGroup)) return;

      [ res.props['vz-role-name'] ] = res.props.children.props.children;
      [ , , res.props['vz-online-count'] ] = res.props.children.props.children;
    } catch (err) {
      return main.error(main._labels.concat(labels.concat('RoleHeader')), err);
    }
  });
  setImmediate(() => forceUpdateElement(`.${membersGroup}`));
  return () => unpatch('vz-attributes-members-role-headers');
};
