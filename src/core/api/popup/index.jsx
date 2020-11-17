const { React, React: { useState, useEffect } } = require('@vizality/react');
const { PopupWindow, Titlebar, Spinner } = require('@vizality/components');
const { getModule } = require('@vizality/webpack');
const { Events } = require('@vizality/constants');
const { API } = require('@vizality/entities');

const PopupIframeContent = React.memo(props => {
  const [ loading, setLoading ] = useState(true);
  const { url, windowKey, themeOverride, titlebarType } = props;

  const sandbox = 'allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts';

  useEffect(() => {
    return () => {
      this.emit(Events.VIZALITY_POPUP_WINDOW_CLOSE, props.windowKey);
      delete vizality.api.popup.windows[props.windowKey];
    };
  }, []);

  return (
    <div className='vz-popup-window'>
      <Titlebar type={titlebarType} windowKey={windowKey} themeOverride={themeOverride} focused={true} />
      {loading && <Spinner className='vz-popup-window-spinner' />}
      <div className='vz-popup-window-content-wrapper'>
        <iframe
          src={url}
          onLoad={() => setLoading(false)}
          className='vz-popup-window-content'
          allowtransparency={true}
          sandbox={sandbox}
        />
      </div>
    </div>
  );
});

module.exports = class PopupAPI extends API {
  constructor () {
    super();

    this.windows = {};
  }

  /**
   * Opens a website URL in an iframe in a popup window.
   * @param {object} props Popup window properties
   * @fires PopupAPI#popupWindowOpen
   */
  async openWindow (props, options = {}) {
    props.id = props.id || `DISCORD_EXT_LINK_${(Math.random().toString(36) + Date.now()).substring(2, 7)}`;
    props.title = props.title || 'Discord Popup';
    options.width = options.width || 800;
    options.height = options.height || 600;

    const { id, title, url, titlebarType } = props;
    const { width, height } = options;

    const y = global.top.outerHeight / 2 + global.top.screenY - (height / 2);
    const x = global.top.outerWidth / 2 + global.top.screenX - (width / 2);

    options.top = y;
    options.left = x;

    if (this.windows[id]) {
      return this.error(`Popup window with ID "${id}" is already used by another plugin.`);
    }

    this.windows[id] = props;

    return new Promise(resolve => {
      const popoutModule = getModule('setAlwaysOnTop', 'open');
      popoutModule.open(id, key => {
        return <PopupWindow windowKey={key} title={title}>
          <PopupIframeContent titlebarType={titlebarType} url={url} windowKey={key} resolve={resolve} />
        </PopupWindow>;
      }, options);

      this.emit(Events.VIZALITY_POPUP_WINDOW_OPEN, id);
    });
  }

  /**
   * Closes a popup window.
   * @param {string} id Popup window ID
   * @fires PopupAPI#popupClosed
   */
  closeWindow (id) {
    if (!this.windows[id]) {
      return this.error(`Popup window with ID "${id}" not found.`);
    }

    delete this.windows[id];
  }
};
