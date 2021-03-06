import React, { memo, PureComponent } from 'react';

import { getModule, getModuleByDisplayName } from '@vizality/webpack';

export default class AsyncComponent extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      Component: null
    };
  }

  async componentDidMount () {
    this.setState({
      Component: await this.props._provider()
    });
  }

  render () {
    const { Component } = this.state;
    if (Component) {
      return <Component {...this.props} />;
    }
    return this.props._fallback || null;
  }

  /**
   * Creates an AsyncComponent from a promise
   * @param {Promise} promise Promise of a React component
   */
  static from (promise, fallback) {
    return memo(props =>
      <AsyncComponent _provider={() => promise} _fallback={fallback} {...props} />
    );
  }

  static fromDisplayName (displayName, fallback) {
    return AsyncComponent.from(getModuleByDisplayName(displayName, true), fallback);
  }

  static fromProps (filter, fallback) {
    return AsyncComponent.from(getModule(filter, true), fallback);
  }

  static fetchFromProps (filter, prop, fallback) {
    return AsyncComponent.from((async () => (await getModule(filter, true))[prop || filter])(), fallback);
  }
}
