const { React } = require('vizality/webpack');
const { classNames } = require('vizality/util');

module.exports = React.memo(({ type, wrapperClassName, className, ...props }) =>
  <div className={classNames('vizality-icon-wrapper', wrapperClassName)}>
    <icon className={classNames('vizality-icon', type, className)} {...props}></icon>
  </div>
);
