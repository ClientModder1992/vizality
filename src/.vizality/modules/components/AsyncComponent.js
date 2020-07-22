const { React } = require('@webpack');

class AsyncComponent extends React.PureComponent {
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
      return React.createElement(Component, Object.assign({}, this.props, this.props._pass));
    }
    return this.props._fallback || null;
  }

  /**
   * Creates an AsyncComponent from a promise
   * @param {Promise} promise Promise of a React component
   */
  static from (promise, fallback) {
    return React.memo(
      (props) => React.createElement(AsyncComponent, {
        _provider: () => promise,
        _fallback: fallback,
        ...props
      })
    );
  }
}

module.exports = AsyncComponent;