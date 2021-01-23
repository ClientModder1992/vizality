import React, { memo, useState, useEffect } from 'react';

import { PopupWindow, Titlebar, Spinner } from '@vizality/components';
import { getModule } from '@vizality/webpack';
import { Events } from '@vizality/constants';
import { API } from '@vizality/entities';

export default class Windows extends API {
  constructor () {
    super();
    this.windows = {};
    this._module = 'API';
    this._submodule = 'Windows';
  }

  /**
   * Opens a website URL in an iframe in a popup window.
   * @param {object} window Popup window properties
   * @param {object} [options] Popup window properties
   * @emits Windows#popupWindowOpen
   */
  async openWindow (window, options = {}) {
    try {
      window.windowId = window.windowId || `window-${(Math.random().toString(36) + Date.now()).substring(2, 10)}`;
      options.width = options.width || 800;
      options.height = options.height || 600;

      let Render;

      // Show a titlebar if they don't specify titlebar={false}
      if (typeof window.titlebar === 'undefined' || window.titlebar === null) window.titlebar = true;


      window.title = window.title || 'Discord Popup';
      // Let url override render
      if (window.url) window.render = null;
      if (window.render) Render = window.render;

      // Center the window based on the user's screen size
      const y = window.top.outerHeight / 2 + window.top.screenY - (options.height / 2);
      const x = window.top.outerWidth / 2 + window.top.screenX - (options.width / 2);

      options.top = options.top || y;
      options.left = options.left || x;

      if (this.windows[window.windowId]) {
        throw new Error(`Popup window with ID "${window.windowId}" already active!`);
      }

      this.windows[window.windowId] = window;

      const PopupContent = memo(props => {
        const [ loading, setLoading ] = useState(true);
        const { url, windowKey, titlebarType, titlebar, children } = props;
        const sandbox = 'allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts';

        useEffect(() => {
          this.emit(Events.VIZALITY_POPUP_WINDOW_OPEN, windowKey);
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
        const popupModule = getModule('setAlwaysOnTop', 'open');
        popupModule.open(`DISCORD_${window.windowId}`, key => {
          return (
            <PopupWindow windowKey={key} {...window}>
              <PopupContent windowKey={key} {...window}>
                {window.render && !window.url && <Render {...window} />}
              </PopupContent>
            </PopupWindow>
          );
        }, options);
      });
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Closes a popup window.
   * @param {string} windowId Popup window ID
   * @emits Windows#popupWindowClosed
   */
  closeWindow (windowId) {
    try {
      if (!this.windows[windowId]) {
        throw new Error(`Popup window with ID "${windowId}" not found!`);
      }

      const popupModule = getModule('setAlwaysOnTop', 'open');
      popupModule.close(`DISCORD_${windowId}`);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Sets a popup window to always be on top of other windows.
   * @param {string} windowId Popup window ID
   * @param {boolean} [alwaysOnTop=true] Whether the window should always be on top or not
   */
  setAlwaysOnTop (windowId, alwaysOnTop = true) {
    try {
      const popupModule = getModule('setAlwaysOnTop', 'open');
      popupModule.setAlwaysOnTop(`DISCORD_${windowId}`, alwaysOnTop);
    } catch (err) {
      return this.error(err);
    }
  }

  stop () {
    delete vizality.api.windows;
    this.removeAllListeners();
  }
}
