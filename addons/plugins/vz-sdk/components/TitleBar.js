const { Icons: { SdkWordmark }, AsyncComponent } = require('@components');
const { getModule } = require('@webpack');
const { React } = require('@react');

const TitleBar = AsyncComponent.from((async () => {
  const titleBar = getModule(m => typeof m === 'function' && m.toString().includes('PlatformTypes.WINDOWS') && m.toString().includes('PlatformTypes.OSX'));
  const windows = titleBar({ type: 'WINDOWS' }).type;
  return (props) => {
    const res = windows(props);
    res.props.className += ' vizality-sdk-title';
    res.props.children[0].props.children = React.createElement(SdkWordmark, { height: 16 });
    return res;
  };
})());

module.exports = TitleBar;
