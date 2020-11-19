/* eslint-disable no-unused-vars */
const { promises: { readFile }, watch, writeFileSync, readFileSync } = require('fs');
const { join } = require('path');

const { default: MonacoEditor } = require('@vizality/builtins/snippet-manager/node_modules/@monaco-editor/react');
const { React, React: { useEffect, useState, useRef } } = require('@vizality/react');
const { AsyncComponent, Spinner } = require('@vizality/components');
const { dom: { injectShadowStyles } } = require('@vizality/util');
const { Flux, getModule } = require('@vizality/webpack');
const { joinClassNames } = require('@vizality/util');

const Editor = React.memo(({ getSetting, toggleSetting, updateSetting }) => {
  const [ , setIsEditorReady ] = useState(false);
  const [ value, setValue ] = useState(getSetting('custom-css', ''));

  let editor = useRef();
  let model = useRef();
  const valueGetter = useRef();

  const QuickCode = vizality.manager.builtins.get('quick-code');
  const customCSSFile = QuickCode._customCSSFile;

  const _handleMonacoUpdate = async (ev, val) => {
    val = val.trim();
    writeFileSync(customCSSFile, val);
    updateSetting('custom-css', val);
  };

  const _watchFiles = async () => {
    if (QuickCode.watcher) return;
    QuickCode.watcher = watch(customCSSFile, { persistent: false }, async (eventType, filename) => {
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
      <MonacoEditor
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

module.exports = AsyncComponent.from((async () => {
  const windowStore = await getModule('getWindow');
  return Flux.connectStores([ windowStore, vizality.api.settings.store ], () => ({
    guestWindow: windowStore.getWindow('DISCORD_VIZALITY_CUSTOM_CSS'),
    windowOnTop: windowStore.getIsAlwaysOnTop('DISCORD_VIZALITY_CUSTOM_CSS'),
    ...vizality.api.settings._fluxProps('quick-code')
  }))(Editor);
})());

