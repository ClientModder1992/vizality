import { ipcRenderer } from 'electron';

import { IpcChannels } from '@vizality/constants';

export const labels = [ 'Misc' ];

export default main => {
  try {
    const root = document.documentElement;

    ipcRenderer.invoke(IpcChannels.VIZALITY_WINDOW_IS_MAXIMIZED).then(isMaximized => {
      if (isMaximized) root.setAttribute('vz-window', 'maximized');
      else root.setAttribute('vz-window', 'restored');
    });

    const setMaximized = () => root.setAttribute('vz-window', 'maximized');
    const setRestored = () => root.setAttribute('vz-window', 'restored');

    ipcRenderer.on(IpcChannels.VIZALITY_WINDOW_MAXIMIZE, setMaximized);
    ipcRenderer.on(IpcChannels.VIZALITY_WINDOW_UNMAXIMIZE, setRestored);

    return () => {
      ipcRenderer.removeListener(IpcChannels.VIZALITY_WINDOW_UNMAXIMIZE, setRestored);
      ipcRenderer.removeListener(IpcChannels.VIZALITY_WINDOW_UNMAXIMIZE, setRestored);
    };
  } catch (err) {
    return main.error(main._labels.concat(labels.concat('Window')), err);
  }
};
