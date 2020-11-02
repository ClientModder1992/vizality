const { joinClassNames } = require('@util');
const { getModule } = require('@webpack');
const { React } = require('@react');

const Icon = require('./Icon');

module.exports = React.memo(props => {
  const { error, backgroundRed, icon, text } = getModule('error', 'backgroundRed');
  const { marginBottom20 } = getModule('marginBottom20');

  return (
    <div className={joinClassNames(error, backgroundRed, marginBottom20)}>
      <Icon className={icon} name='WarningCircle' />
      <div className={text}>
        {props.children}
      </div>
    </div>
  );
});
