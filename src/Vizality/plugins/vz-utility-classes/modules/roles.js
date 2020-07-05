const { inject, uninject } = require('vizality/injector');
const { getModule } = require('vizality/webpack');
const { getOwnerInstance, waitFor, joinClassNames } = require('vizality/util');

module.exports = async () => {
  const { role } = await getModule([ 'role', 'roleCircle', 'roleName', 'root' ]);
  const instance = getOwnerInstance(await waitFor(`.${role.split(' ')[0]}`));

  inject('vz-utility-classes-roles', instance.__proto__, 'render', function (originalArgs, returnValue) {
    if (!this || !this.props || !this.props.role) return returnValue;

    const { role } = this.props;

    returnValue.props['vz-role-id'] = role.id;
    returnValue.props['vz-role-name'] = role.name;
    returnValue.props['vz-role-color-string'] = role.colorString;

    returnValue.props.className = joinClassNames(
      returnValue.props.className, {
        'vz-isHoisted': role.hoist,
        'vz-isMentionable': role.mentionable
      });

    /*
     * @todo: Add this as a settings option
     *
     * res.props.style.color = role.colorString;
     */

    return returnValue;
  });

  return async () => uninject('vz-utility-classes-roles');
};
