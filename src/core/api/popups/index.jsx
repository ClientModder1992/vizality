const { React, React: { useState, useEffect } } = require('@vizality/react');
const { PopupWindow, Titlebar, Spinner } = require('@vizality/components');
const { getModule } = require('@vizality/webpack');
const { Events } = require('@vizality/constants');
const { API } = require('@vizality/entities');

const PopupContent = React.memo(props => {
  const [ loading, setLoading ] = useState(true);
  const { url, windowKey, titlebarType, titlebar } = props;

  const sandbox = 'allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts';

  useEffect(() => {
    return () => {
      /*
       * @todo Fix this. Not sure how to set it when it's not apart of the class
       * that extends API.
       * events.emit(Events.VIZALITY_POPUP_WINDOW_CLOSE, props.windowKey);
       */
      delete vizality.api.popups.windows[props.windowKey];
    };
  }, []);

  return (
    <div className='vz-popup-window' vz-titlebar={titlebar ? '' : null}>
      {titlebar && <Titlebar type={titlebarType} windowKey={windowKey} focused={true} />}
      {loading && url && <Spinner className='vz-popup-window-spinner' />}
      <div className='vz-popup-window-content-wrapper'>
        {url
          ? <iframe
            src={url}
            onLoad={() => setLoading(false)}
            className='vz-popup-window-content'
            allowtransparency={true}
            sandbox={sandbox}
          />
          : <>
            {props.children}
          </>}
      </div>
    </div>
  );
});

module.exports = class PopupsAPI extends API {
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

    const { id } = props;
    const { width, height } = options;
    let Render;

    // Show a titlebar if they don't specify titlebar={false}
    if (typeof props.titlebar === 'undefined' || props.titlebar === null) props.titlebar = true;

    // Let url override render
    if (props.url) props.render = null;
    if (props.render) Render = props.render;

    // Center the popup window based on the user's screen size
    const y = global.top.outerHeight / 2 + global.top.screenY - (height / 2);
    const x = global.top.outerWidth / 2 + global.top.screenX - (width / 2);

    options.top = options.top || y;
    options.left = options.left || x;

    if (this.windows[id]) {
      return this.error(`Popup window with ID "${props.id}" is already used by another plugin.`);
    }

    this.windows[id] = props;

    // eslint-disable-next-line no-unused-vars
    return new Promise(_resolve => {
      const popoutModule = getModule('setAlwaysOnTop', 'open');
      popoutModule.open(id, key => {
        return (
          <PopupWindow windowKey={key} {...props}>
            <PopupContent windowKey={key} {...props}>
              {props.render && !props.url && <Render {...props} />}
            </PopupContent>
          </PopupWindow>
        );
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
