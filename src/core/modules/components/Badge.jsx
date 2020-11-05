const { joinClassNames } = require('@vizality/util');
const { React } = require('@vizality/react');

module.exports = React.memo(({ type, className, ...props }) =>
  <div className={joinClassNames('vizality-badge', type, className)} {...props}></div>
);
