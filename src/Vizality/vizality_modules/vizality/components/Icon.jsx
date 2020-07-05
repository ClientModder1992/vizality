const { React } = require('vizality/webpack');
const { joinClassNames } = require('vizality/util');

module.exports = React.memo(({ type, wrapperClassName, className, ...props }) =>
  <div className={joinClassNames('vizality-icon-wrapper', wrapperClassName)}>
    <icon className={joinClassNames('vizality-icon', type, className)} {...props}></icon>
  </div>
);
