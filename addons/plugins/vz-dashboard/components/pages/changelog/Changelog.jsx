const { shell: { openExternal } } = require('electron');
const { promises: { readFile } } = require('fs');
const Markdown = require('react-markdown');
const { join } = require('path');

const { Icon } = require('@components');
const { React, getModule, React: { useState } } = require('@webpack');
const { DIR: { ROOT_DIR } } = require('@constants');
const { joinClassNames, string: { toKebabCase } } = require('@utilities');

const Changelog = join(ROOT_DIR, 'CHANGELOG.md');

const Content = require('../../parts/Content');

// @todo Make this into a reuseable Markdown component.
module.exports = React.memo(() => {
  const [ markdown, setMarkdown ] = useState();

  const { base } = getModule('base');
  const { size32, size24, size20, size16, size14, size12 } = getModule('size32');
  const { colorStandard } = getModule('colorStandard');
  const { anchor, anchorUnderlineOnHover } = getModule('anchorUnderlineOnHover');

  (async () => {
    const md = await readFile(Changelog, 'utf-8');
    setMarkdown(md.replace(/{(fixed|added|improved|progress)( marginTop)?}/g, '').replace(/(# Changelog)/, ''));
  })();

  const flatten = (text, child) => {
    return typeof child === 'string'
      ? text + child
      : React.Children.toArray(child.props.children).reduce(flatten, text);
  };

  const renderers = {
    root: ({ children }) => {
      return <Content className='vizality-markdown-wrapper'>
        {children}
      </Content>;
    },

    paragraph: ({ children }) => {
      return <p className='vizality-p'>
        {children}
      </p>;
    },

    list: ({ type, children }) => {
      return React.createElement(type ? 'ol' : 'ul', {
        className: 'vizality-list'
      }, children);
    },

    listItem: ({ children }) => {
      return <li className='vizality-list-item'>
        {children}
      </li>;
    },

    link: ({ href, children }) => {
      return <>
        <a href={href} onClick={() => openExternal(href)} className={joinClassNames('vizality-link', anchor, anchorUnderlineOnHover)}>
          {children}
        </a>
      </>;
    },

    heading: ({ level, children }) => {
      const sizes = [ null, size32, size24, size20, size16, size14, size12 ];
      const text = children.reduce(flatten, '');
      const slug = `vizality-header_${toKebabCase(text.toLowerCase().replace(/\W/g, '-'))}-${Math.random().toString(36).substring(2, 8)}`;

      return React.createElement(`h${level}`, {
        className: joinClassNames('vizality-header', `vizality-header-h${level}`, sizes[level], base),
        id: slug
      }, React.createElement('a', {
        className: 'vizality-header-anchor',
        href: `#${slug}`
      }, React.createElement(Icon, {
        className: 'vizality-header-anchor-icon',
        name: 'Link',
        width: '16px',
        height: '16px'
      })),
      children);
    }
  };

  return <Markdown source={markdown} renderers={renderers} />;
});
