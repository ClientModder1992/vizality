/**
 * @deprecated:
 * @powercord: This function/module is only here to provide
 * backwards-compatability with Powercord plugins that may utilize it.
 *
 * Plugins should be using `dom.createElement` instead.
 */


module.exports = (name, props) => {
  const element = document.createElement(name);

  for (const prop in props) {
    // noinspection JSUnfilteredForInLoop
    if ([ 'style', 'href' ].includes(prop) || prop.startsWith('data-')) {
      // noinspection JSUnfilteredForInLoop
      element.setAttribute(prop, props[prop]);
    } else {
      // noinspection JSUnfilteredForInLoop
      element[prop] = props[prop];
    }
  }

  return element;
};
