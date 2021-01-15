export default () => {
  const root = document.documentElement;
  const date = new Date();

  if (date.getMonth() === 1 && date.getDate() === 1) root.setAttribute('vz-holiday', 'new-years');
  if (date.getMonth() === 3 && date.getDate() === 1) root.setAttribute('vz-holiday', 'april-fools');
  if (date.getMonth() === 10 && date.getDate() === 31) root.setAttribute('vz-holiday', 'halloween');
  if (date.getMonth() === 12 && date.getDate() === 25) root.setAttribute('vz-holiday', 'christmas');

  return () => {
    root.removeAttribute('vz-holiday');
  };
};
