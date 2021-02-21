import { ipcRenderer } from 'electron';

export default () => {
  const root = document.documentElement;

  ipcRenderer.invoke('VIZALITY_WINDOW_IS_MAXIMIZED').then(isMaximized => {
    if (isMaximized) root.setAttribute('vz-window', 'maximized');
    else root.setAttribute('vz-window', 'restored');
  });

  const setMaximized = () => root.setAttribute('vz-window', 'maximized');
  const setRestored = () => root.setAttribute('vz-window', 'restored');

  ipcRenderer.on('VIZALITY_WINDOW_MAXIMIZE', setMaximized);
  ipcRenderer.on('VIZALITY_WINDOW_UNMAXIMIZE', setRestored);

  return () => {
    ipcRenderer.removeListener('VIZALITY_WINDOW_UNMAXIMIZE', setRestored);
    ipcRenderer.removeListener('VIZALITY_WINDOW_UNMAXIMIZE', setRestored);
  };
};
