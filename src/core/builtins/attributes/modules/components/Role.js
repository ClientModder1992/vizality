const { joinClassNames, dom: { waitForElement }, react: { getOwnerInstance } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');

module.exports = async () => { void 0;
  // const { roleCircle } = getModule('roleCircle', 'roleName', 'root');
  // const instance = getOwnerInstance(await waitForElement(`.${roleCircle.split(' ')[0]}`));

  // patch('vz-attributes-roles', instance.__proto__, 'render', function (args, res) {
  //   if (!this?.props?.role) return res;
  //   console.log(this);
  //   console.log(args);
  //   console.log(res);

  //   const { role } = this.props;

  //   res.props['vz-role-id'] = role.id;
  //   res.props['vz-role-name'] = role.name;
  //   res.props['vz-role-color-string'] = role.colorString;

  //   res.props.className = joinClassNames(
  //     res.props.className, {
  //       'vz-isHoisted': role.hoist,
  //       'vz-isMentionable': role.mentionable
  //     });

  //   /*
  //    * @todo Add this as a core settings option.
  //    * res.props.style.color = role.colorString;
  //    */

  //   return res;
  // });

  // return () => unpatch('vz-attributes-roles');
};
