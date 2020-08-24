const Webpack = require('@webpack');

module.exports = class AsyncComponent extends Webpack.React.PureComponent {
  constructor (props) {
    super(props);
    this.state = { Component: null };
  }

  async componentDidMount () {
    this.setState({ Component: await this.props._provider() });
  }

  render () {
    const { Component } = this.state;
    if (Component) {
      return Webpack.React.createElement(Component, Object.assign({}, this.props, this.props._pass));
    }
    return this.props._fallback || null;
  }

  /**
   * Creates an AsyncComponent from a promise.
   * @param {Promise<ReactComponent>} promise Promise of a React component
   * @param {ReactComponent} fallback Fallback React component
   * @returns {AsyncComponent}
   */
  static from (promise, fallback) {
    return Webpack.React.memo(
      (props) => Webpack.React.createElement(AsyncComponent, {
        _provider: () => promise,
        _fallback: fallback,
        ...props
      })
    );
  }
};
