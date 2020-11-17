const { joinClassNames, dom: { waitForElement }, react: { getOwnerInstance } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');

module.exports = async () => {
  const { role } = getModule('role', 'roleCircle', 'roleName', 'root');
  const instance = getOwnerInstance(await waitForElement(`.${role.split(' ')[0]}`));

  patch('vz-attributes-roles', instance.__proto__, 'render', function (_, res) {
    if (!this || !this.props || !this.props.role) return res;

    const { role } = this.props;

    res.props['vz-role-id'] = role.id;
    res.props['vz-role-name'] = role.name;
    res.props['vz-role-color-string'] = role.colorString;

    res.props.className = joinClassNames(
      res.props.className, {
        'vz-isHoisted': role.hoist,
        'vz-isMentionable': role.mentionable
      });

    /*
     * @todo: Add this as a settings option
     * res.props.style.color = role.colorString;
     */

    return res;
  });

  return async () => unpatch('vz-attributes-roles');
};
