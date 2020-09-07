const { shell: { openExternal } } = require('electron');
const { existsSync, promises: { readFile } } = require('fs');
const Markdown = require('react-markdown');

const { joinClassNames, string: { toKebabCase } } = require('@util');
const { React, React: { useState } } = require('@react');
const { getModule, getModuleByDisplayName } = require('@webpack');
const { Icon, CodeBlock } = require('@components');
const { open: openModal } = require('vizality/modal');

const ImageModal = getModuleByDisplayName('ImageModal');

module.exports = React.memo(({ source, className }) => {
  const [ markdown, setMarkdown ] = useState();

  const { base } = getModule('base');
  const { size32, size24, size20, size16, size14, size12 } = getModule('size32');
  const { anchor, anchorUnderlineOnHover } = getModule('anchorUnderlineOnHover');
  const { imageWrapper } = getModule('imageWrapper');

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
      return <p className='vz-markdown__p'>
        {children}
      </p>;
    },

    list: ({ ordered, start, children }) => {
      const attrs = {};
      if (start !== null && start !== 1 && start !== undefined) {
        attrs.start = start.toString();
      }
      return React.createElement(ordered ? 'ol' : 'ul', {
        className: joinClassNames('vz-markdown__list', `vz-markdown__list--${ordered ? 'ol' : 'ul'}`),
        start: attrs.start
      }, children);
    },

    listItem: ({ children }) => {
      return <li className='vz-markdown__list-item'>
        {children}
      </li>;
    },

    link: ({ href, children }) => {
      return <>
        <a href={href} onClick={() => openExternal(href)} className={joinClassNames('vz-markdown__link', anchor, anchorUnderlineOnHover)}>
          {children}
        </a>
      </>;
    },

    linkReference: ({ href, children }) => {
      return <>
        <a href={href} onClick={() => openExternal(href)} className={joinClassNames('vz-markdown__link', anchor, anchorUnderlineOnHover)}>
          {children}
        </a>
      </>;
    },

    emphasis: ({ children }) => {
      return <em className='vz-markdown__em'>{children}</em>;
    },

    strong: ({ children }) => {
      return <strong className='vz-markdown__strong'>{children}</strong>;
    },

    blockquote: ({ children }) => {
      return <blockquote className='vz-markdown__blockquote'>{children}</blockquote>;
    },

    thematicBreak: () => {
      return <hr className='vz-markdown__hr' />;
    },

    code: ({ language, value }) => {
      return <CodeBlock language={language} content={value} />;
    },

    inlineCode: ({ children }) => {
      return <code className='vz-markdown__code--inline inline'>{children}</code>;
    },

    image: ({ alt, src }) => {
      return <img
        className={joinClassNames('vz-markdown__image', imageWrapper)}
        src={src}
        alt={alt}
        onClick={() => {
          openModal(() => React.createElement(ImageModal, {
            className: 'vizality-image-modal',
            src
          }));
        }}
      />;
    },

    imageReference: ({ alt, src }) => {
      return <img
        className={joinClassNames('vz-markdown__image', imageWrapper)}
        src={src}
        alt={alt}
        onClick={() => {
          openModal(() => React.createElement(ImageModal, {
            className: 'vizality-image-modal',
            src
          }));
        }}
      />;
    },

    table: ({ children }) => {
      return <table className='vz-markdown__table'>{children}</table>;
    },

    tableHead: ({ children }) => {
      return <thead className='vz-markdown__thead'>{children}</thead>;
    },

    tableBody: ({ children }) => {
      return <tbody className='vz-markdown__tbody'>{children}</tbody>;
    },

    tableRow: ({ children }) => {
      return <tr className='vz-markdown__tr'>{children}</tr>;
    },

    tableCell: ({ isHeader, align, children }) => {
      return isHeader
        ? <th className={joinClassNames('vz-markdown__th', { 'vz-markdown__th--align-right': align })}>{children}</th>
        : <td className={joinClassNames('vz-markdown__td', { 'vz-markdown__td--align-right': align })}>{children}</td>;
    },

    heading: ({ level, children }) => {
      const sizes = [ null, size32, size24, size20, size16, size14, size12 ];
      const text = children.reduce(flatten, '');
      const slug = `vz-markdown__header:${toKebabCase(text.toLowerCase().replace(/\W/g, '-'))}-${Math.random().toString(36).substring(2, 8)}`;

      return React.createElement(`h${level}`, {
        className: joinClassNames('vz-markdown__header', `vz-markdown__header--h${level}`, sizes[level], base),
        id: slug
      }, React.createElement('a', {
        className: 'vz-markdown__anchor',
        href: `#${slug}`
      }, React.createElement(Icon, {
        className: 'vz-markdown__anchor-icon',
        name: 'Link',
        width: '16px',
        height: '16px'
      })),
      children);
    }
  };
  return <Markdown source={markdown} renderers={renderers} />;
});
