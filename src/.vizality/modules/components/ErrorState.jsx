const { getModule } = require('@webpack');
const { React } = require('@react');

const AsyncComponent = require('./AsyncComponent');
const Icon = require('./Icon');

module.exports = AsyncComponent.from((() => {
  const { error, backgroundRed, icon, text } = getModule('error', 'backgroundRed');
  const { marginBottom20 } = getModule('marginBottom20');

  return (props) => (
    <div className={`${error} ${backgroundRed} ${marginBottom20}`}>
      <Icon className={icon} name='WarningCircle'/>
      <div className={text}>
        {props.children}
      </div>
    </div>
  );
})());
