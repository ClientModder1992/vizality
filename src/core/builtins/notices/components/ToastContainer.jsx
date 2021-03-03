import React, { memo, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { useForceUpdate } from '@vizality/hooks';

import Toast from './Toast';

export default memo(() => {
  const [ closing, setClosing ] = useState(null);
  const forceUpdate = useForceUpdate();
  const toast = Object.keys(vizality.api.notices.toasts).pop();
  const _addedHandler = () => forceUpdate();
  const _closingHandler = id => {
    setClosing(id);
    setTimeout(() => setClosing(null), 510);
  };

  useEffect(() => {
    vizality.api.notices.on('toastAdded', _addedHandler);
    vizality.api.notices.on('toastClosing', _closingHandler);
    return () => {
      vizality.api.notices.on('toastAdded', _addedHandler);
      vizality.api.notices.on('toastClosing', _closingHandler);
    };
  }, []);

  return (
    <ToastContainer className='vz-toast-container' />
  );
});
