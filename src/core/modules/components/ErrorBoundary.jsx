import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';
import React, { PureComponent } from 'react';
import { Messages } from '@vizality/i18n';
import { get } from '@vizality/http';
import { resolve } from 'path';
import { format } from 'util';
import { parse } from 'url';

const RE_INVARIANT_URL = /https?:\/\/reactjs\.org\/docs\/error-decoder\.html\?invariant=([0-9]+)(?:[^ ])+/;

const ReactInvariant = get('https://raw.githubusercontent.com/facebook/react/master/scripts/error-codes/codes.json')
  .then(res => JSON.parse(res.body.toString()));

const { PremiumModalHeaderAnimationTier2 } = getModule('PremiumModalHeaderAnimationTier2');
export default class VizalityErrorBoundary extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      hasCrashed: false,
      errorStack: '',
      componentStack: ''
    };
    this.classes = {
      ...getModule('colorStandard'),
      ...getModule('thin', 'scrollerBase')
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
    return (
      <>
        {this.state.hasCrashed && <div className={joinClassNames('vz-error-boundary', this.props.className, this.classes.colorStandard)}>
          <h1 className={joinClassNames('vz-error-boundary-header', this.props.headerClassName)}>
            {Messages.ERROR_GENERIC_TITLE}
          </h1>
          <div className='vz-error-boundary-text'>
            An error occurred while rendering the page:
          </div>
          <div className={joinClassNames('vz-error-boundary-block', 'vz-error-boundary-error-stack', this.classes.thin)}>
            {this.state.errorStack}
          </div>
          <div className='vz-error-boundary-text'>
            Component stack:
          </div>
          <div className={joinClassNames('vz-error-boundary-block', 'vz-error-boundary-component-stack', this.classes.thin)}>
            {this.state.componentStack}
          </div>
          {this.props.showScene && <PremiumModalHeaderAnimationTier2 className='vz-error-boundary-scene'/>}
        </div>}
        {!this.state.hasCrashed && this.props.children}
      </>
    );
  }
}
