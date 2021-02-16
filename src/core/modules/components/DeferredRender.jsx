import React, { memo, useState, useEffect } from 'react';

import { Spinner } from '.';

export default memo(({ children, idleTimeout = 0, fallback = <Spinner /> }) => {
  const [ render, setRender ] = useState(false);

  useEffect(() => {
    if (render) setRender(false);
    const id = requestIdleCallback(() => setRender(true), { timeout: idleTimeout });
    return () => cancelIdleCallback(id);
  }, [ idleTimeout ]);

  if (!render) return fallback;

  return children;
});
