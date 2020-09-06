const { clipboard } = require('electron');

const { React, React: { useState } } = require('@react');
const { getModule, getModules } = require('@webpack');
const { joinClassNames } = require('@util');
const { Messages } = require('@i18n');

/*
 * @todo Convert showHeader, showLineNumbers, showCopyButton, and theme into settings options and then
 * set the default values here to be the settings values.
 */

/**
 * Component for display codeblocks
 * @component
 * @example
 * ```jsx
 * <CodeBlock language='CSS' theme='Dracula' showLineNumbers={false} content={
 *  `React.createElement(Icon, {\n` +
 *  `  name: '${iconName}'\n` +
 *  `});`}
 * />
 * ```
 */
module.exports = React.memo(({
  language = 'js',
  header,
  content,
  showHeader = true,
  showLineNumbers = true,
  showCopyButton = true,
  theme
}) => {
  const [ copyText, setCopyText ] = useState(Messages.COPY);
  const { markup } = getModule('markup');
  const { marginBottom20 } = getModule('marginBottom20');
  const { scrollbarGhostHairline } = getModule('scrollbarGhostHairline');
  const { highlight } = getModules([ 'highlight' ])[4];
  const { getLanguage } = getModule('initHighlighting', 'highlight');

  // Set language to its full name, or `null` if a name is not found
  if (!getLanguage(language).name) language = undefined;

  // Set header to `language` if showHeader is true and no header is provided and the language is recognized
  header = header || getLanguage(language) ? getLanguage(language).name : undefined;

  // Make `theme` lowercase if it's provided
  if (theme) theme = theme.toLowerCase();

  const handleCodeCopy = () => {
    // Prevent clicking when it's still showing copied
    if (copyText === Messages.COPIED) return;

    setCopyText(Messages.COPIED);

    setTimeout(() => setCopyText(Messages.COPY), 1000);

    clipboard.writeText(content);
  };

  /** @private **/
  function renderCode (language, content) {
    return React.createElement('div', {
      className: 'vz-code-block__inner',
      dangerouslySetInnerHTML: {
        __html: language ? highlight(language, content).value : content
      }
    });
  }

  return (
    <div className={joinClassNames('vz-code-block__markup', markup, marginBottom20)}>
      <pre className='vz-code-block__pre'>
        <code className={joinClassNames('hljs', scrollbarGhostHairline, 'vz-code-block', {
          [language]: language,
          'vz-has-header': header && showHeader,
          'vz-has-line-numbers': showLineNumbers,
          'vz-has-copy-button': showCopyButton,
          [`vz-code-block--theme-${theme}`]: theme
        })}>
          {renderCode(language, content)}
          {(header && showHeader) && <div className='vz-code-block__header'>{header}</div>}
          {showLineNumbers && <div className='vz-code-block__line-numbers'/>}
          {showCopyButton && <button
            className={joinClassNames('vz-code-block__copy-button', { 'vz-is-copied': copyText === Messages.COPIED })}
            onClick={handleCodeCopy}>{copyText}
          </button>}
        </code>
      </pre>
    </div>
  );
});
