const { getModule } = require('@vizality/webpack');

const AsyncComponent = require('./AsyncComponent');

module.exports = AsyncComponent.from((async () => {
  const DiscordPopoutWindow = getModule(m => m.DecoratedComponent && m.DecoratedComponent.render);
  class PopoutWindow extends DiscordPopoutWindow {
    constructor (props) {
      if (!props.withTitleBar) {
        // Enforce it
        props.withTitleBar = false;
      }
      super(props);
    }

    componentDidMount () {
      const instance = this.getDecoratedComponentInstance();
      const { guestWindow } = instance.props;

      document.querySelectorAll('style[vz-style]').forEach(style => {
        guestWindow.document.head.innerHTML += style.outerHTML;
      });
    }
  }

  return PopoutWindow;
})());
