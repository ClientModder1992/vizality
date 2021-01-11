import { promises, watch, writeFileSync, readFileSync } from 'fs';
import React, { memo, useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { join } from 'path';

import { joinClassNames, injectShadowStyles, getElementDimensions } from '@vizality/util/dom';
import { Spinner } from '@vizality/components';

const { readFile } = promises;

export default memo(props => {
  const { main, getSetting, updateSetting } = props;
  const [ , setIsEditorReady ] = useState(false);
  const [ value, setValue ] = useState(getSetting('customCSS', ''));

  let editor = useRef();
  let model = useRef();
  const valueGetter = useRef();

  const customCSSFile = main._customCSSFile;

  const _handleMonacoUpdate = async (ev, val) => {
    val = val.trim();
    writeFileSync(customCSSFile, val);
    updateSetting('customCSS', val);
  };

  const _watchFiles = async () => {
    if (main.watcher) return;
    main.watcher = watch(customCSSFile, { persistent: false }, async (eventType, filename) => {
      if (!eventType || !filename) return;
      const val = readFileSync(customCSSFile).toString();
      if (val !== getSetting('customCSS')) updateSetting('customCSS', val);
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
        height={getElementDimensions(document.querySelector('.vz-dashboard')).height - getElementDimensions(document.querySelector('.vz-dashboard-content-header-wrapper')).height}
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
