export default () => {
  const root = document.documentElement;
  /**
   * @todo Figure out how to do this for all settings and connect it to the settings flux
   * listener, or maybe just use an event emitter.
   */

   // @todo Fix this.
  // const attributes = {
  //   transparentWindow: vizality.settings.get('transparentWindow', false),
  //   experimentalWebPlatform: vizality.settings.get('experimentalWebPlatform', false)
  // };

  // const addAttributes = Object.keys(attributes).filter(m => attributes[m]);
  // const removeAttributes = Object.keys(attributes).filter(m => !attributes[m]);

  // addAttributes.forEach(attr => root.setAttribute(attr, ''));
  // removeAttributes.forEach(attr => root.removeAttribute(attr));

  return () => {
    root.removeAttribute('vz-settings');
  };
};
