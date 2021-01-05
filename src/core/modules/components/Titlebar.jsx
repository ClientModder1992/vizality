import React, { memo } from 'react';

import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';

export default memo(props => {
  let { type, windowKey, className } = props;
  delete props.className;

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

  return <Titlebar className={joinClassNames('vz-titlebar', className)} type={type} windowKey={windowKey} {...props} />;
});
