const { resolve } = require('path');
const { format } = require('util');
const { parse } = require('url');

const { joinClassNames } = require('@util');
const { getModule } = require('@webpack');
const { React } = require('@react');
const { get } = require('@http');

const RE_INVARIANT_URL = /https?:\/\/reactjs\.org\/docs\/error-decoder\.html\?invariant=([0-9]+)(?:[^ ])+/;

const ReactInvariant = get('https://raw.githubusercontent.com/facebook/react/master/scripts/error-codes/codes.json')
  .then(res => JSON.parse(res.body.toString()));

module.exports = class VizalityErrorBoundary extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      hasCrashed: false,
      errorStack: '',
      componentStack: ''
    };
  }

  componentDidCatch (error, info) {
    this.setState({ hasCrashed: true });
    ReactInvariant.then(invariant => {
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

        errorStack = `React Invariant Violation #${code}\n${format(invariant[code], ...args)}`;
      } else {
        const basePath = resolve(__dirname, '../../../');

        errorStack = (error.stack || '')
          .split('\n')
          .filter(l => !l.includes('discordapp.com/assets/') && !l.includes('discord.com/assets/'))
          .join('\n')
          .split(basePath)
          .join('');
      }

      this.setState({
        errorStack,
        componentStack
      });
    });
  }

  render () {
    const { colorStandard } = getModule('colorStandard');

    return (
      <>
        {this.state.hasCrashed && <div className={joinClassNames('vz-error-boundary', this.props.className, colorStandard)}>
          <h1 className={joinClassNames('vz-error-boundary-header', this.props.headerClassName)}>Huh, that's odd.</h1>
          <div className='vz-error-boundary-text'>An error occurred while rendering the page:</div>
          <div className='vz-error-boundary-block vz-error-boundary-error-stack'>{this.state.errorStack}</div>
          <div className='vz-error-boundary-text'>Component stack:</div>
          <div className='vz-error-boundary-block vz-error-boundary-component-stack'>{this.state.componentStack}</div>
          <div className='vz-error-boundary-scene'>
            <div className='vz-error-boundary-flying-wumpus-wrapper'>
              <img className='vz-error-boundary-flying-wumpus' src='/assets/7558b67985f4035ed2b2cf9e3072d81f.svg' />
            </div>
            <div className='vz-error-boundary-clouds'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 762 331' className='vz-error-boundary-cloud vz-is-big vz-is-front vz-is-slowest'>
                <path fill='currentColor' d='M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
                c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
                C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
                S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z'/>
              </svg>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 762 331' className='vz-error-boundary-cloud vz-is-distant vz-is-smaller'>
                <path fill='currentColor' d='M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
                c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
                C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
                S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z'/>
              </svg>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 762 331' className='vz-error-boundary-cloud vz-is-small vz-is-slow'>
                <path fill='currentColor' d='M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
                c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
                C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
                S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z'/>
              </svg>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 762 331' className='vz-error-boundary-cloud vz-is-distant vz-is-super-slow vz-is-massive'>
                <path fill='currentColor' d='M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
                c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
                C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
                S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z'/>
              </svg>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 762 331' className='vz-error-boundary-cloud vz-is-slower'>
                <path fill='currentColor' d='M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
                c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
                C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
                S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z'/>
              </svg>
            </div>
          </div>
        </div>}
        {!this.state.hasCrashed && this.props.children}
      </>
    );
  }
};
