import { getModule } from '@vizality/webpack';
import { Regexes } from '@vizality/constants';

import AsyncComponent from './AsyncComponent';

export default AsyncComponent.from((async () => {
  const DiscordPopoutWindow = getModule(m => m.DecoratedComponent?.render);
  class PopupWindow extends DiscordPopoutWindow {
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
      document.querySelectorAll('style').forEach(style => {
        guestWindow.document.head.appendChild(
          document.importNode(style, true)
        );
      });
      document.querySelectorAll(`link[rel='stylesheet']`).forEach(stylesheet => {
        if (stylesheet.href.startsWith('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/')) return;
        if (new RegExp(Regexes.DISCORD).test(stylesheet.href)) return;
        guestWindow.document.head.appendChild(
          document.importNode(stylesheet, true)
        );
      });
    }
  }
  return PopupWindow;
})());
