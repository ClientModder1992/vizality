import React, { memo, useState, useEffect } from 'react';

import { PopupWindow, Titlebar, Spinner } from '@vizality/components';
import { getModule } from '@vizality/webpack';
import { Events } from '@vizality/constants';
import { API } from '@vizality/entities';

export default class Popups extends API {
  constructor () {
    super();
    this._module = 'API';
    this._submodule = 'Popups';
  }

  /**
   * Opens a website URL in an iframe in a popup popup.
   * @param {object} popup Popup
   * @param {object} [options={}] Popup options
   * @emits Popups#popupOpen
   */
  async openPopup (popup, options = {}) {
    try {
      popup.popupId = popup.popupId || `popup-${(Math.random().toString(36) + Date.now()).substring(2, 10)}`;
      options.width = options.width || 800;
      options.height = options.height || 600;

      let Render;

      // Show a titlebar if they don't specify titlebar={false}
      if (typeof popup.titlebar !== 'boolean') popup.titlebar = true;


      popup.title = popup.title || 'Discord Popup';
      // Let url override render
      if (popup.url) popup.render = null;
      if (popup.render) Render = popup.render;

      // Center the popup based on the user's screen size
      const y = window.top.outerHeight / 2 + window.top.screenY - (options.height / 2);
      const x = window.top.outerWidth / 2 + window.top.screenX - (options.width / 2);

      options.top = options.top || y;
      options.left = options.left || x;

      if (window.popouts.has(popup.popupId)) {
        throw new Error(`Popup with ID "${popup.popupId}" already active!`);
      }

      const PopupContent = memo(props => {
        const [ loading, setLoading ] = useState(true);
        const { url, windowKey, titlebarType, titlebar, children } = props;
        const sandbox = 'allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts';

        useEffect(() => {
          this.emit(Events.VIZALITY_POPUP_OPEN, windowKey);
          return () => {
            this.emit(Events.VIZALITY_POPUP_CLOSE, windowKey);
            window.popouts.delete(windowKey);
          };
        }, []);

        return (
          <div className='vz-popup' vz-titlebar={titlebar ? '' : null}>
            {titlebar && <Titlebar type={titlebarType} windowKey={windowKey} focused={true} />}
            {loading && url && <Spinner className='vz-popup-spinner' />}
            <div className='vz-popup-content-wrapper'>
              {url
                ? <iframe
                  src={url}
                  onLoad={() => setLoading(false)}
                  className='vz-popup-content'
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
        popupModule.open(`DISCORD_${popup.popupId}`, key => {
          return (
            <PopupWindow windowKey={key} {...popup}>
              <PopupContent windowKey={key} {...popup}>
                {popup.render && !popup.url && <Render {...popup} />}
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
   * Closes a popup.
   * @param {string} popupId Popup ID
   * @emits Popups#popupClosed
   */
  closePopup (popupId) {
    try {
      if (!window.popouts.has(popupId)) {
        throw new Error(`Popup with ID "${popupId}" not found!`);
      }

      const popupModule = getModule('setAlwaysOnTop', 'open');
      popupModule.close(`DISCORD_${popupId}`);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Sets a popup to always be on top of other popups.
   * @param {string} popupId Popup ID
   * @param {boolean} [alwaysOnTop=true] Whether the popup should always be on top or not
   */
  setAlwaysOnTop (popupId, alwaysOnTop = true) {
    try {
      const popupModule = getModule('setAlwaysOnTop', 'open');
      popupModule.setAlwaysOnTop(`DISCORD_${popupId}`, alwaysOnTop);
    } catch (err) {
      return this.error(err);
    }
  }

  stop () {
    delete vizality.api.popups;
    this.removeAllListeners();
  }
}
