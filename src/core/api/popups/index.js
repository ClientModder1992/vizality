import React, { memo, useState, useEffect } from 'react';

import { PopupWindow, Titlebar, Spinner } from '@vizality/components';
import { getModule } from '@vizality/webpack';
import { Events } from '@vizality/constants';
import { API } from '@vizality/entities';

export default class PopupsAPI extends API {
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
    props.id = props.id || `external-url-${(Math.random().toString(36) + Date.now()).substring(2, 10)}`;
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
    const y = window.top.outerHeight / 2 + window.top.screenY - (height / 2);
    const x = window.top.outerWidth / 2 + window.top.screenX - (width / 2);

    options.top = options.top || y;
    options.left = options.left || x;

    if (this.windows[id]) {
      return this.error(`Popup window with ID "${props.id}" is already used by another plugin.`);
    }

    this.windows[id] = props;

    const PopupContent = memo(props => {
      const [ loading, setLoading ] = useState(true);
      const { url, windowKey, titlebarType, titlebar, children } = props;
      const sandbox = 'allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts';

      useEffect(() => {
        return () => {
          this.emit(Events.VIZALITY_POPUP_WINDOW_CLOSE, windowKey);
          delete this.windows[windowKey];
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
              : children
            }
          </div>
        </div>
      );
    });

    return new Promise(() => {
      const popoutModule = getModule('setAlwaysOnTop', 'open');
      popoutModule.open(`DISCORD_${id}`, key => {
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

    const popoutModule = getModule('setAlwaysOnTop', 'open');
    popoutModule.close(`DISCORD_${id}`);

    delete this.windows[id];
  }
}
