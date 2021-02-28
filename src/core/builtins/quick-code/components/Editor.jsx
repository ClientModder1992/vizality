import { watch, writeFileSync, readFileSync } from 'fs';
import React, { memo, useEffect, useState, useRef } from 'react';
import { Editor } from '@vizality/components';

import { joinClassNames } from '@vizality/util/dom';
import { Spinner } from '@vizality/components';

export default memo(props => {
  const { main, getSetting, updateSetting, popout } = props;
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

  const handleEditorDidMount = async (_valueGetter, _editor, editorDOM) => {

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
        wrapperClassName={joinClassNames('vz-editor-wrapper', 'vz-quick-code-css-wrapper')}
        className={joinClassNames('vz-editor', 'vz-quick-code-css')}
        language='scss'
        value={value}
        theme={'vs-dark'}
        vz-editor-theme={'vs-dark'}
        editorDidMount={handleEditorDidMount}
        loading={<Spinner />}
        popout={popout}
        options={{
          minimap: {
            enabled: false
          }
        }}
      />
    </>
  );
});
