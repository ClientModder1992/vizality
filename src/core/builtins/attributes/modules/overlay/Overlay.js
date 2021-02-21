export default () => {
  const root = document.documentElement;

  if (window.__OVERLAY__) root.setAttribute('vz-overlay', '');

  return () => {
    root.removeAttribute('vz-overlay');
  };
};
