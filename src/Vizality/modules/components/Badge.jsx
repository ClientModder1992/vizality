const { React } = require('vizality/webpack');
const { joinClassNames } = require('vizality/util');

module.exports = React.memo(({ type, className, ...props }) =>
  <div className={joinClassNames('vizality-badge', type, className)} {...props}></div>
);
