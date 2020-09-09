const { clipboard } = require('electron');

const { React, React: { useState } } = require('@react');
const { joinClassNames } = require('@util');
const { getModule } = require('@webpack');
const { Messages } = require('@i18n');

const Button = getModule(m => m.DropdownSizes);

/*
 * @todo Convert showHeader, showLineNumbers, showCopyButton, and theme into settings options and then
 * set the default values here to be the settings values.
 */

/**
 * Component for displaying code blocks, with or without syntax highlighting.
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
  language,
  header,
  content,
  theme,
  showHeader = true,
  showLineNumbers = true,
  showCopyButton = true,
  contentIsRaw = false,
  hasWrapper = true,
  className
}) => {
  const [ copyText, setCopyText ] = useState(Messages.COPY);
  const [ copyButtonColor, setCopyButtonColor ] = useState(Button.Colors.BRAND);
  const { markup } = getModule('markup');
  const { marginBottom20 } = getModule('marginBottom20');
  const { scrollbarGhostHairline } = getModule('scrollbarGhostHairline');
  const { highlight } = getModule('highlight', 'hasLanguage');
  const { getLanguage } = getModule('initHighlighting', 'highlight');

  // Set language to its full name, or `null` if a name is not found
  if (!getLanguage(language)) language = undefined;

  // Set header to `language` if showHeader is true and no header is provided and the language is recognized
  header = header || (getLanguage(language) ? getLanguage(language).name : undefined);

  // Make `theme` lowercase if it's provided
  if (theme) theme = theme.toLowerCase();

  /*
   * This is a bandaid "fix" for the copy button--- we just get rid of it...
   * When using raw HTML as the content, the copy button also copies that raw HTML
   * i.e.:
   * (<span class="hljs-selector-tag">await</span> <span class="hljs-selector-tag">getModule</span>(<span class="hljs-selector-attr">[ <span class="hljs-string">&  #x27;updateLocalSettings&#x27;</span> ]</span>))<span class="hljs-selector-class">.updateLocalSettings</span>({<span class="hljs-attribute">customStatus</span>:
   *   {
   *     text: <span class="hljs-string">&#x27;im a gorilla&#x27;</span>
   *   }
   * });
   */
  if (contentIsRaw) showCopyButton = false;

  const handleCodeCopy = () => {
    // Prevent clicking when it's still showing copied
    if (copyText === Messages.COPIED) return;

    setCopyText(Messages.COPIED);
    setCopyButtonColor(Button.Colors.GREEN);

    setTimeout(() => {
      setCopyText(Messages.COPY);
      setCopyButtonColor(Button.Colors.BRAND);
    }, 1000);

    clipboard.writeText(content);
  };

  /*
   * This needs to be a function like this and using React.createElement instead of JSX
   * Don't ask me why though.
   */
  /** @private **/
  function renderCode (language, content) {
    return React.createElement('div', {
      className: 'vz-code-block-inner',
      dangerouslySetInnerHTML: {
        __html: language && !contentIsRaw ? highlight(language, content).value : content
      }
    });
  }

  const renderCodeBlock = () => {
    return (
      <>
        <pre className='vz-code-block-pre'>
          <code className={joinClassNames('hljs', scrollbarGhostHairline, 'vz-code-block-code', {
            [language]: language,
            'vz-has-header': showHeader && header,
            'vz-has-line-numbers': showLineNumbers,
            'vz-has-copy-button': showCopyButton,
            [`vz-code-block--theme-${theme}`]: theme
          })}>
            {renderCode(language, content)}
            {(header && showHeader) && <div className='vz-code-block-header'>{header}</div>}
            {showLineNumbers && <div className='vz-code-block-line-numbers'/>}
            {showCopyButton && <Button
              className={joinClassNames('vz-code-block-copy-button', { 'vz-is-copied': copyText === Messages.COPIED })}
              color={copyButtonColor}
              look={Button.Looks.FILLED}
              size={Button.Sizes.SMALL}
              onClick={handleCodeCopy}>
              {copyText}
            </Button>}
          </code>
        </pre>
      </>
    );
  };

  return (
    <>
      {hasWrapper
        ? <div className={joinClassNames('vz-code-block-wrapper', className, markup, marginBottom20)}>
          {renderCodeBlock()}
        </div>
        : renderCodeBlock()}
    </>
  );
});
