const { parse } = require('url');
const { format } = require('util');
const { resolve } = require('path');
const { React } = require('powercord/webpack');

const RE_INVARIANT_URL = /https?:\/\/reactjs\.org\/docs\/error-decoder\.html\?invariant=([0-9]+)(?:[^ ])+/;

const ReactInvariant = {
  data: {},
  async fetch () {
    try {
      const resp = await fetch('https://raw.githubusercontent.com/facebook/react/master/scripts/error-codes/codes.json');
      this.data = await resp.json();
    } catch (err) {
      return false;
    }

    return true;
  },
  async get () {
    if (!Object.keys(this.data).length) {
      await this.fetch();
    }
    return this.data;
  }
};

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      crashed: false,
      errorStack: '',
      componentStack: ''
    };
  }

  componentDidCatch (error, info) {
    this.setState({ crashed: true });
    const componentStack = info.componentStack
      .split('\n')
      .slice(1, 7)
      .join('\n');

    let errorStack;
    if (RE_INVARIANT_URL.test(error.stack || '')) {
      const uri = parse(RE_INVARIANT_URL.exec(error.stack)[0], true);

      const code = uri.query.invariant;
      const args =
        uri.query['args[]']
          ? (Array.isArray(uri.query['args[]'])
            ? uri.query['args[]']
            : [ uri.query['args[]'] ]
          )
          : [];

      errorStack = `React Invariant Violation #${code}\n${format(ReactInvariant.data[code], ...args)}`;
    } else {
      const basePath = resolve(__dirname, '../../../');

      errorStack = (error.stack || '')
        .split('\n')
        .filter(l => !l.includes('discordapp.com/assets/'))
        .join('\n')
        .split(basePath)
        .join('');
    }

    this.setState({
      errorStack,
      componentStack
    });
  }

  render () {
    return this.state.crashed
      ? <div className='powercord-text powercord-settings-error'>
        <h2>Huh, that's odd</h2>
        <div>An error occurred while rendering settings panel.</div>
        <code>{this.state.errorStack}</code>
        <div>Component stack:</div>
        <code>{this.state.componentStack}</code>
      </div>
      : this.props.children;
  }
}

ReactInvariant.fetch();
module.exports = ErrorBoundary;
