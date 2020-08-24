const Webpack = require('@webpack');
const Util = require('@util');

const Icon = Webpack.React.memo(({ type, wrapperClassName, className, ...props }) =>
  <div className={Util.Misc.joinClassNames('vizality-icon-wrapper', wrapperClassName)}>
    <icon className={Util.Misc.joinClassNames('vizality-icon', type, className)} {...props}></icon>
  </div>
);

module.exports = Icon;
