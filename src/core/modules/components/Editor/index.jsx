import React, { useEffect, useState, useRef } from 'react';
import { webFrame } from 'electron';
import { promises } from 'fs';
import { join } from 'path';
import { createElement, injectShadowStyles } from '@vizality/util/dom';

const { readFile } = promises;

const realWin = webFrame.top.context;

// The monaco version to use. Downloaded from Cloudflare CDNJS.
const version = '0.21.2';

// Memo might cause issues with popouts due to props being the same, so not memoizing this
export default function MonacoEditor (props) {
  const { height, width, wrapperClassName, className, language, value, theme, editorDidMount, loading, options, popout } = props;
  const windowRef = useRef(popout ? null : realWin);
  const containerRef = useRef();
  const editorRef = useRef();
  const [ isLoading, setLoading ] = useState(true);
  const [ isMounted, setMounted ] = useState(false);
  function setupMonaco () {
    if (!containerRef.current) return;
    const win = windowRef.current;
    if (!win.MonacoEnvironment?.getWorkerUrl) {
      Object.defineProperty(win, 'MonacoEnvironment', {
        value: {
          getWorkerUrl () {
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                    self.MonacoEnvironment = {
                        baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${version}/min'
                    };
                    importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${version}/min/vs/base/worker/workerMain.min.js');`
            )}`;
          }
        }
      });
    }

    const commonjsLoader = window.require;
    async function loadMonaco (monaco) {
      setLoading(false);
      const editor = monaco.editor.create(containerRef.current, {
        extraEditorClassName: className,
        language,
        value,
        theme,
        dimension: { height, width },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        ...options
      });
      editorRef.current = editor;
      const editorDOM = editor.getDomNode();
      const styles = await readFile(join(__dirname, 'contextMenu.css'), 'utf8');
      const observer = new MutationObserver(mutations => {
        mutations.forEach(async mutation => {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            injectShadowStyles(editorDOM.querySelector('.shadow-root-host'), '.context-view', styles);
            observer.disconnect();
          }
        });
      });

      observer.observe(editorDOM, { childList: true, attributes: false, characterData: false, subtree: false });
      editorDidMount(editor.getValue.bind(editor), editor, editorDOM);
    }
    if (!win.document.getElementById('monaco-script')) {
      const script = createElement('script', {
        id: 'monaco-script',
        src: `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${version}/min/vs/loader.min.js`,
        onload: () => {
          const amdLoader = win.require; // Grab Monaco's amd loader
          win.require = commonjsLoader; // Revert to commonjs
          amdLoader.config({ paths: { vs: `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${version}/min/vs` } });
          amdLoader([ 'vs/editor/editor.main' ], loadMonaco);
        }
      });
      win.document.head.appendChild(script);
    } else {
      loadMonaco(win.monaco);
    }
  }

  useEffect(() => () => {
    editorRef.current?.getModel().dispose();
    editorRef.current?.dispose();
  }, []);

  return (
    <div
      className={wrapperClassName}
      ref={(div) => {
        if (!div || isMounted) return;
        if (popout) windowRef.current = div.ownerDocument.defaultView;
        containerRef.current = div;
        setMounted(true);
        setupMonaco();
      }}
    >
      {isLoading && loading}
    </div>
  );
}
