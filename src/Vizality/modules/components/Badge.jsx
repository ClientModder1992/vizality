const { React } = require('@webpack');
const { joinClassNames } = require('@util');

const Badge = React.memo(({ type, className, ...props }) =>
  <div className={joinClassNames('vizality-badge', type, className)} {...props}></div>
);

module.exports = Badge;
