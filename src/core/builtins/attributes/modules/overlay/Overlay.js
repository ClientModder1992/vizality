export const labels = [ 'Overlay' ];

export default main => {
  try {
    const root = document.documentElement;
    if (window.__OVERLAY__) root.setAttribute('vz-overlay', '');
    return () => root.removeAttribute('vz-overlay');
  } catch (err) {
    return main.error(main._labels.concat('Overlay'), err);
  }
};
