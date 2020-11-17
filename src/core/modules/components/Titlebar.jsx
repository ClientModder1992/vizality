/* eslint-disable no-unused-vars *//* eslint-disable prefer-arrow-callback */
const { getModule } = require('@vizality/webpack');
const { React } = require('@vizality/react');

module.exports = React.memo(function VizalityTitlebar ({ type, windowKey, themeOverride, ...props }) {
  if (!type) {
    const OS = DiscordNative.process.platform;
    switch (true) {
      case ((/^win/).test(OS)): type = 'WINDOWS'; break;
      case OS === 'darwin': type = 'OSX'; break;
      case OS === 'linux': type = 'LINUX'; break;
      default: type = 'WINDOWS';
    }
  }

  const mdl = getModule(m => typeof m === 'function' && m.toString().includes('PlatformTypes.WINDOWS') && m.toString().includes('PlatformTypes.OSX'));

  const Titlebar = mdl({ type }).type;

  return <Titlebar type={type} windowKey={windowKey} themeOverride={themeOverride} {...props} />;
});
