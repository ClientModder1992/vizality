import { ToastContainer, toast as sendToast } from 'react-toastify';
import { Icon } from '@vizality/components';
import Constants from '@vizality/constants';
import Webpack from '@vizality/webpack';
import Util from '@vizality/util';
import React from 'react';

import Toast from './Toast';

const { thin } = Webpack.getModule('thin');

/** @private */
const _labels = [ 'Component', 'ToastContainer' ];
/* eslint-disable no-unused-vars */
const _log = (...message) => Util.logger.log({ labels: _labels, message });
const _warn = (...message) => Util.logger.warn({ labels: _labels, message });
const _error = (...message) => Util.logger.error({ labels: _labels, message });

const CloseButton = ({ closeToast }) => (
  <Icon
    name='Close'
    size='18'
    className='vz-toast-close-wrapper'
    iconClassName='vz-toast-close'
    onClick={evt => evt.shiftKey ? vizality.api.notifications.closeAllActiveToasts() : closeToast()}
  />
);

export default React.memo(({ settings }) => {
  // const [ toastId, setToastId ] = React.useState(null);
  const _handleToastSend = toastId => {
    // setToastId(toastId);
    const toast = vizality.api.notifications.getToastById(toastId);
    sendToast(
      <Toast toast={toast} />,
      {
        toastId,
        delay: toast.delay,
        autoClose: toast.autoClose,
        progressStyle: toast.type,
        bodyClassName: Util.dom.joinClassNames('vz-toast-body', thin),
        progressClassName: 'vz-toast-progress-bar',
        className: Util.dom.joinClassNames('vz-toast',
          {
            'Toastify__toast--show-progress-bar': toast.progressBar || (settings.get('autoClose', true) && settings.get('showProgressBar', false)),
            'Toastify__toast--extra-padding': toast.buttons?.length || toast.content || toast.custom
          }
        ),
        onClose: () => vizality.api.notifications.closeToast(toastId)
      }
    );
  };

  React.useEffect(() => {
    // @todo Ask Strencher about this.
    // Send all stored toasts on initialization
    // const toasts = vizality.api.notifications.getAllToasts();
    // toasts.length && toasts.forEach(toast => _handleToastSend(toast.id));
    vizality.api.notifications.closeAllToasts();
    vizality.api.notifications.on(Constants.Events.VIZALITY_TOAST_SEND, _handleToastSend);
    return () => {
      vizality.api.notifications.off(Constants.Events.VIZALITY_TOAST_SEND, _handleToastSend);
    };
  }, []);

  return (
    <ToastContainer
      className='vz-toast-container'
      closeOnClick={false}
      draggable={false}
      hideProgressBar={true}
      newestOnTop={true}
      limit={3}
      // pauseOnFocusLoss={false}
      // autoClose={false}
      closeButton={CloseButton}
      pauseOnHover={true}
      position='bottom-right'
    />
  );
});
