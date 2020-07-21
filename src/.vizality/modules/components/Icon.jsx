const { React } = require('@webpack');
const { joinClassNames } = require('@util');

const Icon = React.memo(({ type, wrapperClassName, className, ...props }) =>
  <div className={joinClassNames('vizality-icon-wrapper', wrapperClassName)}>
    <icon className={joinClassNames('vizality-icon', type, className)} {...props}></icon>
  </div>
);

module.exports = Icon;
