const { joinClassNames } = require('@util');
const { React } = require('@react');

module.exports = React.memo(({ type, className, ...props }) =>
  <div className={joinClassNames('vizality-badge', type, className)} {...props}></div>
);
