const { joinClassNames, string: { toKebabCase }, logger: { log, error, warn } } = require('@util');
const { getModule } = require('@webpack');
const { React } = require('@react');

const CustomIcons = require('./CustomIcons');

const _module = 'Component';
const _submodule = 'Icon';

const Icons = [ ...Object.keys(CustomIcons) ];

const Pee = module.exports = React.memo(({ name, color, width, height, className, ...props }) => {
  const before = performance.now();

  Pee.Names = Icons;

  const after = performance.now();
  log('icon', 'icon', null, `Took ${parseFloat((after - before).toFixed(4)).toString().replace(/^0+/, '')} ms.`);

  return React.createElement(CustomIcons[name], {
    className: joinClassNames('vz-icon', `vz-icon-is-${toKebabCase(name)}`, className),
    width,
    height,
    color,
    ...props
  });
});
