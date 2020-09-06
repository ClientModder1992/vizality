const { clipboard } = require('electron');

const { joinClassNames, react: { findInReactTree, getReactInstance } } = require('@util');
const { getModule, hljs } = require('@webpack');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');
const { Messages } = require('@i18n');
const { React } = require('@react');

module.exports = class CodeBlocks extends Plugin {
  onStart () {
    this.injectStyles('styles/main.scss');
    this.patchCodeblocks();
  }

  onStop () {
    unpatch('vz-codeblocks-inline');
    unpatch('vz-codeblocks-embed');
    this._forceUpdate();
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
    this._forceUpdate();
  }

  injectCodeblock (args, codeblock) {
    const { render } = codeblock.props;

    codeblock.props.render = (codeblock) => {
      const res = render(codeblock);
      const { children } = res.props;
      const isDangerouslySetInnerHTML = children.props.dangerouslySetInnerHTML;
      const lang = args ? args[0].lang : children.props.className.split(' ').find(className => !className.includes('-') && className !== 'hljs');

      // @todo Don't forget to make these into settings and add `theme`.
      children.props.className = joinClassNames(
        children.props.className,
        'vz-code-block',
        'vz-has-line-numbers',
        'vz-has-copy-button',
        {
          'vz-has-header': isDangerouslySetInnerHTML
        }
      );

      if (children.props.dangerouslySetInnerHTML) {
        res.props.className = joinClassNames(res.props.className, 'vz-code-block__pre');
        children.props.children = this.renderCodeblock(lang, children.props.dangerouslySetInnerHTML);
        delete children.props.dangerouslySetInnerHTML;
      } else if (typeof children.props.children === 'string') {
        children.props.children = this.renderCodeblock(lang, children.props.children);
      }
      return res;
    };
  }

  _forceUpdate () {
    document.querySelectorAll(`[id^='chat-messages-']`).forEach(e => getReactInstance(e).memoizedProps.onMouseMove());
  }

  renderCodeblock (lang, content) {
    const children = [];
    const isDangerouslySetInnerHTML = typeof content === 'object';
    const language = hljs.getLanguage(lang) ? hljs.getLanguage(lang).name : undefined;
    const isValidLanguage = typeof language !== 'undefined';

    children.push(React.createElement('div', {
      className: 'vz-code-block__inner',
      dangerouslySetInnerHTML: isDangerouslySetInnerHTML ? content : null
    }, isDangerouslySetInnerHTML ? null : content), isValidLanguage && React.createElement('div', {
      className: 'vz-code-block__header'
    }, language), React.createElement('div', {
      className: 'vz-code-block__line-numbers'
    }), React.createElement('button', {
      className: 'vz-code-block__copy-button',
      onClick: this._onClickHandler
    }, Messages.COPY));

    return children;
  }

  _onClickHandler (e) {
    const { target } = e;

    if (target.classList.contains('vz-is-copied')) return;

    target.innerText = Messages.COPIED;
    target.classList.add('vz-is-copied');

    setTimeout(() => {
      target.innerText = Messages.COPY;
      target.classList.remove('vz-is-copied');
    }, 1000);

    const codeContent = target.parentElement.children[0];

    const range = document.createRange();
    range.selectNode(codeContent);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    clipboard.writeText(selection.toString().trim());

    selection.removeAllRanges();
  }
};
