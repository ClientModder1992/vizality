/* eslint-disable no-unreachable */

const { getModuleByDisplayName } = require('vizality/webpack');
const AsyncComponent = require('./AsyncComponent');

module.exports = AsyncComponent.from((async () => {
  /**
   * @todo: Needs fixing.
   */
  return void 0;

  const DiscordPopoutWindow = getModuleByDisplayName('FluxContainer(PopoutWindow)');
  class PopoutWindow extends DiscordPopoutWindow {
    constructor (props) {
      if (!props.withTitleBar) {
        // Enforce it
        props.withTitleBar = false;
      }
      super(props);
    }

    componentDidMount () {
      super.componentDidMount();
      const store = this.listener.stores.find(s => s.getWindow);
      const guestWindow = store.getWindow(this.props.windowKey);
      document.querySelectorAll('style[vz-style]').forEach(style => {
        guestWindow.document.head.innerHTML += style.outerHTML;
      });
    }
  }

  return PopoutWindow;
})());
