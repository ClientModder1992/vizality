import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export const labels = [ 'Components' ];

export default async main => {
  const { MemberRole } = getModule('MemberRole');
  patch('vz-attributes-roles', MemberRole, 'render', ([ props ], res) => {
    try {
      if (!props?.role) return;
      res.props.children.props['vz-role-id'] = props.role.id;
      res.props.children.props['vz-role-name'] = props.role.name;
      res.props.children.props['vz-role-color-string'] = props.role.colorString;
      res.props.children.props['vz-hoisted'] = Boolean(props.role.hoist) && '';
      res.props.children.props['vz-mentionable'] = Boolean(props.role.mentionable) && '';
    } catch (err) {
      main.error(main._labels.concat(labels.concat('Role')), err);
    }
  });
  return () => unpatch('vz-attributes-roles');
};
