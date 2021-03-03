export const labels = [ 'Misc' ];

export default main => {
  try {
    const root = document.documentElement;
    const date = new Date();
    /*
     * Months start at 0, but dates start at 1... Weird.
     */
    if (date.getMonth() === 0 && date.getDate() === 1) root.setAttribute('vz-holiday', 'new-years');
    if (date.getMonth() === 3 && date.getDate() === 1) root.setAttribute('vz-holiday', 'april-fools');
    if (date.getMonth() === 9 && date.getDate() === 31) root.setAttribute('vz-holiday', 'halloween');
    if (date.getMonth() === 11 && date.getDate() === 25) root.setAttribute('vz-holiday', 'christmas');
    return () => root.removeAttribute('vz-holiday');
  } catch (err) {
    return main.error(main._labels.concat(labels.concat('Holiday')), err);
  }
};
