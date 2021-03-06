import React, { memo, useState, useEffect, Children } from 'react';
import { existsSync, promises } from 'fs';
import Markdown from 'react-markdown';

import { getMediaDimensions } from '@vizality/util/file';
import { toKebabCase } from '@vizality/util/string';
import { open as openModal } from '@vizality/modal';
import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';

import { CodeBlock, Icon, DeferredRender, Spinner, LazyImageZoomable, ImageModal, Anchor } from '.';

const { readFile } = promises;

export default memo(({ source, className }) => {
  const [ markdown, setMarkdown ] = useState();
  const { base } = getModule('base');
  const { size32, size24, size20, size16, size14, size12 } = getModule('size32');
  const { anchor, anchorUnderlineOnHover } = getModule('anchorUnderlineOnHover');
  const { imageWrapper } = getModule('imageWrapper');

  useEffect(() => {
    const getSource = async () => {
      const md = await readFile(source, 'utf-8');
      // For Vizality Changelog
      setMarkdown(md.replace(/{(fixed|added|improved|progress)( marginTop)?}/g, '').replace(/(# Changelog)/, '').trim());
    };

    if (existsSync(source)) {
      getSource();
    } else {
      setMarkdown(source.trim());
    }
  }, [ markdown ]);

  const flatten = (text, child) => {
    return typeof child === 'string'
      ? text + child
      : Children.toArray(child?.props?.children).reduce(flatten, text);
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
      return children;
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

      const ListItem = ordered ? 'ol' : 'ul';
      return (
        <ListItem
          className={joinClassNames('vz-markdown-list', `vz-is-${ordered ? 'ol' : 'ul'}`)}
          start={attrs.start}
        >
          {children}
        </ListItem>
      );
    },

    listItem: ({ children }) => {
      return <li className='vz-markdown-list-item'>
        {children}
      </li>;
    },

    link: ({ href, children }) => {
      return <>
        <Anchor
          href={href}
          className={joinClassNames('vz-markdown-link', anchor, anchorUnderlineOnHover)}
        >
          {children}
        </Anchor>
      </>;
    },

    linkReference: ({ href, children }) => {
      return <>
        <Anchor
          href={href}
          className={joinClassNames('vz-markdown-link-reference', anchor, anchorUnderlineOnHover)}
        >
          {children}
        </Anchor>
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
      return <CodeBlock language={language} content={value} className='vz-markdown-code' />;
    },

    inlineCode: ({ children }) => {
      return <code className='vz-markdown-code-inline'>{children}</code>;
    },

    // @todo Fix this to work with variable dimensions.
    image: ({ alt, src }) => {
      return <LazyImageZoomable
        className={joinClassNames('vz-markdown-image', imageWrapper)}
        src={src}
        alt={alt}
        width='500'
        height='500'
        onClick={e => {
          e.preventDefault();
          openModal(() =>
            <ImageModal
              src={src}
              width='500'
              height='500'
            />
          );
        }}
      />;
    },

    // @todo Fix this to work with variable dimensions.
    imageReference: ({ alt, src }) => {
      return <LazyImageZoomable
        className={joinClassNames('vz-markdown-image', imageWrapper)}
        src={src}
        alt={alt}
        width='500'
        height='500'
        onClick={e => {
          e.preventDefault();
          openModal(() =>
            <ImageModal
              src={src}
              width='500'
              height='500'
            />);
        }}
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
      const slug = `vz-markdown-header--${generateId(text)}`;
      const Header = `h${level}`;

      return (
        <Header id={slug} className={joinClassNames('vz-markdown-header', `vz-markdown-header-h${level}`, sizes[level], base)}>
          <Anchor className='vz-markdown-anchor' href={`#${slug}`}>
            <Icon name='Link' className='vz-markdown-anchor-icon' iconClassName='vz-markdown-anchor-icon' size='16px' />
          </Anchor>
          {children}
        </Header>
      );
    }
  };
  return (
    <>
      {existsSync(source)
        ? <DeferredRender idleTimeout={2500} fallback={
          <div className='vz-markdown-content-loading'>
            <Spinner />
          </div>
        }>
          <Markdown source={markdown} renderers={renderers} />
        </DeferredRender>
        : <Markdown source={markdown} renderers={renderers} />
      }
    </>
  );
});
