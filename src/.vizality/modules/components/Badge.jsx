const Webpack = require('@webpack');
const Util = require('@util');

const Badge = Webpack.React.memo(({ type, className, ...props }) =>
  <div className={Util.Misc.joinClassNames('vizality-badge', type, className)} {...props}></div>
);

module.exports = Badge;
