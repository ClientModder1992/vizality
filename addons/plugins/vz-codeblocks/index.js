const { Plugin } = require('@entities');
const { patch, unpatch } = require('@patcher');
const { React, getModule, hljs } = require('@webpack');
const { react: { findInReactTree } } = require('@utilities');

const { clipboard } = require('electron');

class Codeblocks extends Plugin {
  onStart () {
    this.injectStyles('style.scss');
    this.patchCodeblocks();
    console.log('Hmm');
  }

  onStop () {
    unpatch('vz-codeblocks-inline');
    unpatch('vz-codeblocks-embed');

    document.querySelectorAll('.hljs [class^=vizality]').forEach(e => e.remove());
  }

  async patchCodeblocks () {
    const parser = getModule('parse', 'parseTopic');
    patch('vz-codeblocks-inline', parser.defaultRules.codeBlock, 'react', (args, res) => {
      this.injectCodeblock(args, res);

      return res;
    });

    patch('vz-codeblocks-embed', parser, 'parseAllowLinks', (_, res) => {
      for (const children of res) {
        const codeblock = findInReactTree(children, n => n.type && n.type.name === '');
        if (codeblock) {
          this.injectCodeblock(null, codeblock);
        }
      }

      return res;
    });
  }

  injectCodeblock (args, codeblock) {
    const { render } = codeblock.props;

    codeblock.props.render = (codeblock) => {
      const res = render(codeblock);

      const { children } = res.props;
      const lang = args ? args[0].lang : children.props.className.split(' ').find(className => !className.includes('-') && className !== 'hljs');

      if (children.props.dangerouslySetInnerHTML) {
        children.props.children = this.renderCodeblock(lang, children.props.dangerouslySetInnerHTML);

        delete children.props.dangerouslySetInnerHTML;
      } else if (typeof children.props.children === 'string') {
        children.props.children = this.renderCodeblock(lang, children.props.children);
      }

      return res;
    };
  }

  renderCodeblock (lang, content) {
    const children = [];
    const isDangerouslySetInnerHTML = typeof content === 'object';
    const isValidLanguage = typeof hljs.getLanguage(lang) !== 'undefined';

    children.push(React.createElement('div', {
      dangerouslySetInnerHTML: isDangerouslySetInnerHTML ? content : null
    }, isDangerouslySetInnerHTML ? null : content), isValidLanguage && React.createElement('div', {
      className: 'vizality-codeblock-lang'
    }, lang), React.createElement('div', {
      className: 'vizality-lines'
    }), React.createElement('button', {
      className: 'vizality-codeblock-copy-btn',
      onClick: this._onClickHandler
    }, 'copy'));

    return children;
  }

  _onClickHandler (e) {
    const { target } = e;

    if (target.classList.contains('copied')) {
      return;
    }

    target.innerText = 'copied!';
    target.classList.add('copied');

    setTimeout(() => {
      target.innerText = 'copy';
      target.classList.remove('copied');
    }, 1000);

    const codeContent = target.parentElement.children[0];
    const vzCopy = codeContent.querySelector('[data-vizality-codeblock-copy]');
    if (vzCopy) {
      return clipboard.writeText(vzCopy.textContent);
    }

    const range = document.createRange();
    range.selectNode(codeContent);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    clipboard.writeText(selection.toString());

    selection.removeAllRanges();
  }
}

module.exports = Codeblocks;
