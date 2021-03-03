import { warn } from '@vizality/util/logger';

import { patch, unpatch } from '@vizality/patcher';
import { getModule } from'@vizality/webpack';

export default () => {
  const { MemberRole } = getModule('MemberRole') || {};
  if (MemberRole) {
    patch('vz-attributes-roles', MemberRole, 'render', ([ props ], res) => {
      const role = props?.role;
      if (!role) {
        warn({ labels: [ 'attributes-roles' ], message: [ 'Failed to inject roles attributes!',  '"role" prop was not found!'] });
        return res;
      }

      try {
        const roleItem = res?.props?.children?.props;
        if (!roleItem) throw 'roleItem was not found!';
        
        roleItem['vz-role-id'] = role.id;
        roleItem['vz-role-name'] = role.name;
        roleItem['vz-role-color-string'] = role.colorString;
        roleItem['vz-hoisted'] = Boolean(role.hoist) && '';
        roleItem['vz-mentionable'] = Boolean(role.mentionable) && '';
        
      } catch (error) {
        error({ labels: [ 'attributes-roles' ], message: [ 'Failed to inject roles attributes!', error ] });
      }

    });
  } else warn({ labels: [ 'attributes-roles' ], message: '"MemberRole" module was not found!' });

  return () => unpatch('vz-attributes-roles');
};
