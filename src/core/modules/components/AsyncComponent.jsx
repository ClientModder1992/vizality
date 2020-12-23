import React, { memo, useState, useEffect } from 'react';

import { getModule, getModuleByDisplayName } from '@vizality/webpack';

export default function AsyncComponent (props) {
  const [ Component, setComponent ] = useState(null);

  useEffect(() => {
    setComponent(props._provider());
  }, []);

  if (Component) {
    props = Object.assign({}, props, props._pass);
    return <Component {...props} />;
  }

  return props._fallback || null;
}

/**
 * Creates an AsyncComponent from a promise
 * @param {Promise} promise Promise of a React component
 */
AsyncComponent.from = (promise, fallback) => {
  return memo(props =>
    <AsyncComponent _provider={() => promise} _fallback={fallback} {...props} />
  );
};

AsyncComponent.fromDisplayName = (displayName, fallback) => {
  return AsyncComponent.from(getModuleByDisplayName(displayName, true), fallback);
};

AsyncComponent.fromProps = (filter, fallback) => {
  return AsyncComponent.from(getModule(filter, true), fallback);
};

AsyncComponent.fetchFromProps = (filter, prop, fallback) => {
  return AsyncComponent.from((async () => (await getModule(filter, true))[prop || filter])(), fallback);
};
