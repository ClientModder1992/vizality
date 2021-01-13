import React, { memo, useState, useEffect } from 'react';

import { PopupWindow, Titlebar, Spinner } from '@vizality/components';
import { error } from '@vizality/util/logger';
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
   * @param {object} props Popup window properties
   * @fires Windows#popupWindowOpen
   */
  async openWindow (props, options = {}) {
    props.windowId = props.windowId || `window-${(Math.random().toString(36) + Date.now()).substring(2, 10)}`;
    options.width = options.width || 800;
    options.height = options.height || 600;

    let Render;

    // Show a titlebar if they don't specify titlebar={false}
    if (typeof props.titlebar === 'undefined' || props.titlebar === null) props.titlebar = true;


    props.title = props.title || 'Discord Popup';
    // Let url override render
    if (props.url) props.render = null;
    if (props.render) Render = props.render;

    // Center the window based on the user's screen size
    const y = window.top.outerHeight / 2 + window.top.screenY - (options.height / 2);
    const x = window.top.outerWidth / 2 + window.top.screenX - (options.width / 2);

    options.top = options.top || y;
    options.left = options.left || x;

    if (this.windows[props.windowId]) {
      return this.error(`Window with ID "${props.id}" is already used by another plugin.`);
    }

    this.windows[props.windowId] = props;

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
      popoutModule.open(`DISCORD_${props.windowId}`, key => {
        return (
          <PopupWindow windowKey={key} {...props}>
            <PopupContent windowKey={key} {...props}>
              {props.render && !props.url && <Render {...props} />}
            </PopupContent>
          </PopupWindow>
        );
      }, options);

      this.emit(Events.VIZALITY_POPUP_WINDOW_OPEN, props.windowId);
    });
  }

  /**
   * Closes a popup window.
   * @param {string} windowId Popup window ID
   * @fires Windows#popupClosed
   */
  closeWindow (windowId) {
    if (!this.windows[windowId]) {
      return this.error(`Window with ID "${windowId}" not found.`);
    }

    const popoutModule = getModule('setAlwaysOnTop', 'open');
    popoutModule.close(`DISCORD_${windowId}`);

    delete this.windows[windowId];
  }

  setAlwaysOnTop (windowId, boolean = true) {
    try {
      const popoutModule = getModule('setAlwaysOnTop', 'open');
      popoutModule.setAlwaysOnTop(`DISCORD_${windowId}`, boolean);
    } catch (err) {
      return error(this._module, `${this._submodule}:setAlwaysOnTop`, null, err);
    }
  }
}
