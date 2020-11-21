/* eslint-disable no-unused-vars */
const { promises: { readFile }, watch, writeFileSync, readFileSync } = require('fs');
const { join } = require('path');

const { default: Editor } = require('@vizality/builtins/snippet-manager/node_modules/@monaco-editor/react');
const { React, React: { useEffect, useState, useRef } } = require('@vizality/react');
const { dom: { injectShadowStyles } } = require('@vizality/util');
const { Spinner } = require('@vizality/components');
const { joinClassNames } = require('@vizality/util');

module.exports = React.memo(props => {
  const { main, getSetting, updateSetting } = props;
  const [ , setIsEditorReady ] = useState(false);
  const [ value, setValue ] = useState(getSetting('custom-css', ''));

  let editor = useRef();
  let model = useRef();
  const valueGetter = useRef();

  const customCSSFile = main._customCSSFile;

  const _handleMonacoUpdate = async (ev, val) => {
    val = val.trim();
    writeFileSync(customCSSFile, val);
    updateSetting('custom-css', val);
  };

  const _watchFiles = async () => {
    if (main.watcher) return;
    main.watcher = watch(customCSSFile, { persistent: false }, async (eventType, filename) => {
      if (!eventType || !filename) return;
      const val = readFileSync(customCSSFile).toString();
      if (val !== getSetting('custom-css')) updateSetting('custom-css', val);
      if (val !== value) setValue(val);
    });
  };

  const handleEditorDidMount = (_valueGetter, _editor) => {
    const editorDOM = document.querySelector('.monaco-editor');
    const observer = new MutationObserver(mutations => {
      mutations.forEach(async mutation => {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const styles = await readFile(join(__dirname, 'contextMenu.css'), 'utf8');
          injectShadowStyles(document.querySelector('.shadow-root-host'), '.context-view', styles);
          observer.disconnect();
        }
      });
    });

    observer.observe(editorDOM, { childList: true, attributes: false, characterData: false, subtree: false });

    setIsEditorReady(true);
    valueGetter.current = _valueGetter;
    editor = _editor;

    model = editor.getModel();

    model.updateOptions({ insertSpaces: true, tabSize: 2 });

    editor.onDidChangeModelContent(ev => {
      _handleMonacoUpdate(ev, valueGetter.current());
    });
  };

  useEffect(() => {
    _watchFiles();
  });

  return (
    <>
      <Editor
        height='100%'
        width='100%'
        wrapperClassName='vz-editor-wrapper'
        className={joinClassNames('vz-editor', 'vz-quick-code-css')}
        language='scss'
        value={value}
        theme={'vs-dark'}
        vz-editor-theme={'vs-dark'}
        editorDidMount={handleEditorDidMount}
        loading={<Spinner />}
        options={{
          minimap: {
            enabled: false
          },
          scrollBeyondLastLine: false
        }}
      />
    </>
  );
});
