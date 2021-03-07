import Constants from '@vizality/constants';
import Hooks from '@vizality/hooks';
import React from 'react';

import Notice from './Notice';

export default React.memo(() => {
  const forceUpdate = Hooks.useForceUpdate();
  const _handler = () => forceUpdate();

  React.useEffect(() => {
    vizality.api.notifications.on(Constants.Events.VIZALITY_NOTICE_SEND, _handler);
    vizality.api.notifications.on(Constants.Events.VIZALITY_NOTICE_CLOSE, _handler);
    return () => {
      vizality.api.notifications.off(Constants.Events.VIZALITY_NOTICE_SEND, _handler);
      vizality.api.notifications.off(Constants.Events.VIZALITY_NOTICE_CLOSE, _handler);
    };
  }, []);

  return vizality.api.notifications.getAllNotices().map(notice => <Notice {...notice} />);
});
