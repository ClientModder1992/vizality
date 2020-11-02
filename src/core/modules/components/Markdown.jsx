/* eslint-disable prefer-arrow-callback */
const { existsSync, promises: { readFile } } = require('fs');
const { shell: { openExternal } } = require('electron');
const Markdown = require('react-markdown');

const { joinClassNames, string: { toKebabCase } } = require('@util');
const { getModule, getModuleByDisplayName } = require('@webpack');
const { React, React: { useState } } = require('@react');
const { open: openModal } = require('vizality/modal');
const { Icon, CodeBlock } = require('@components');

module.exports = React.memo(function VizalityMarkdown ({ source, className }) {
  const [ markdown, setMarkdown ] = useState();
  const { base } = getModule('base');
  const { size32, size24, size20, size16, size14, size12 } = getModule('size32');
  const { anchor, anchorUnderlineOnHover } = getModule('anchorUnderlineOnHover');
  const { imageWrapper } = getModule('imageWrapper');
  const ImageModal = getModuleByDisplayName('ImageModal');

  // This would probably better be done as a hook with useEffect, but meh.
  (async () => {
    if (markdown) return;
    if (existsSync(source)) {
      const md = await readFile(source, 'utf-8');
      // For Vizality Changelog
      setMarkdown(md.replace(/{(fixed|added|improved|progress)( marginTop)?}/g, '').replace(/(# Changelog)/, '').trim());
    } else {
      setMarkdown(source.trim());
    }
  })();

  const flatten = (text, child) => {
    return typeof child === 'string'
      ? text + child
      : React.Children.toArray(child.props.children).reduce(flatten, text);
  };

  const generateId = (() => {
    let index = 0;
    return (prefix = '') => {
      index += 1;
      return `${prefix}-${index}`;
    };
  })();

  const renderers = {
    root: ({ children }) => {
      return <div className={joinClassNames('vz-markdown', className)}>
        {children}
      </div>;
    },

    /*
     * text: ({ children }) => {
     *   return <span className='vz-markdown__span'>{children}</span>;
     * },
     */

    paragraph: ({ children }) => {
      return <p className='vz-markdown-p'>
        {children}
      </p>;
    },

    list: ({ ordered, start, children }) => {
      const attrs = {};
      if (start !== null && start !== 1 && start !== undefined) {
        attrs.start = start.toString();
      }
      return React.createElement(ordered ? 'ol' : 'ul', {
        className: joinClassNames('vz-markdown-list', `vz-is-${ordered ? 'ol' : 'ul'}`),
        start: attrs.start
      }, children);
    },

    listItem: ({ children }) => {
      return <li className='vz-markdown-list-item'>
        {children}
      </li>;
    },

    link: ({ href, children }) => {
      return <>
        <a href={href} onClick={() => openExternal(href)} className={joinClassNames('vz-markdown-link', anchor, anchorUnderlineOnHover)}>
          {children}
        </a>
      </>;
    },

    linkReference: ({ href, children }) => {
      return <>
        <a href={href} onClick={() => openExternal(href)} className={joinClassNames('vz-markdown-link', anchor, anchorUnderlineOnHover)}>
          {children}
        </a>
      </>;
    },

    emphasis: ({ children }) => {
      return <em className='vz-markdown-em'>{children}</em>;
    },

    strong: ({ children }) => {
      return <strong className='vz-markdown-strong'>{children}</strong>;
    },

    blockquote: ({ children }) => {
      return <blockquote className='vz-markdown-blockquote'>{children}</blockquote>;
    },

    thematicBreak: () => {
      return <hr className='vz-markdown-hr' />;
    },

    code: ({ language, value }) => {
      return <CodeBlock language={language} content={value} />;
    },

    inlineCode: ({ children }) => {
      return <code className='vz-markdown-code--inline inline'>{children}</code>;
    },

    image: ({ alt, src }) => {
      return <img
        className={joinClassNames('vz-markdown-image', imageWrapper)}
        src={src}
        alt={alt}
        onClick={() => openModal(() => <ImageModal className='vizality-image-modal' src={src} />)}
      />;
    },

    imageReference: ({ alt, src }) => {
      return <img
        className={joinClassNames('vz-markdown-image', imageWrapper)}
        src={src}
        alt={alt}
        onClick={() => openModal(() => <ImageModal className='vizality-image-modal' src={src} />)}
      />;
    },

    table: ({ children }) => {
      return <table className='vz-markdown-table'>{children}</table>;
    },

    tableHead: ({ children }) => {
      return <thead className='vz-markdown-thead'>{children}</thead>;
    },

    tableBody: ({ children }) => {
      return <tbody className='vz-markdown-tbody'>{children}</tbody>;
    },

    tableRow: ({ children }) => {
      return <tr className='vz-markdown-tr'>{children}</tr>;
    },

    tableCell: ({ isHeader, align, children }) => {
      return isHeader
        ? <th className={joinClassNames('vz-markdown-th', { 'vz-markdown-th vz-align-right': align })}>{children}</th>
        : <td className={joinClassNames('vz-markdown-td', { 'vz-markdown-td vz-align-right': align })}>{children}</td>;
    },

    heading: ({ level, children }) => {
      const sizes = [ null, size32, size24, size20, size16, size14, size12 ];
      const text = toKebabCase(children.reduce(flatten, ''));
      const slug = `vz-markdown-header:${generateId(text)}`;

      return React.createElement(`h${level}`, {
        className: joinClassNames('vz-markdown-header', `vz-markdown-header-h${level}`, sizes[level], base),
        id: slug
      }, React.createElement('a', {
        className: 'vz-markdown-anchor',
        href: `#${slug}`
      }, React.createElement(Icon, {
        className: 'vz-markdown-anchor-icon',
        name: 'Link',
        width: '16px',
        height: '16px'
      })),
      children);
    }
  };
  return <Markdown source={markdown} renderers={renderers} />;
});
