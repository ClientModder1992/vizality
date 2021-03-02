import React, { useEffect, useState, useRef } from 'react';
import { createElement } from '@vizality/util/dom';

const version = '0.21.2';

// Memo might cause issues with popouts, so not memoizing this
export default function MonacoEditor (props) {
  const { height, width, wrapperClassName, className, language, value, theme, editorDidMount, loading, options, popout } = props;
  const windowRef = useRef(popout ? null : window)
  const containerRef = useRef()
  const editorRef = useRef();
  const [ isLoading, setLoading ] = useState(true)
  const [ isMounted, setMounted ] = useState(false)
  function setupMonaco () {
    if (!containerRef.current) return
    const win = windowRef.current
    console.log(win)
    if (!win.MonacoEnvironment?.getWorkerUrl) {
      Object.defineProperty(win, "MonacoEnvironment", {
        value: {
            getWorkerUrl: function() {
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
    // if (!win.document.getElementById('monaco-styles')) {
    //   const styles = createElement('link', {
    //     id: 'monaco-styles',
    //     rel: 'stylesheet',
    //     href: `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${version}/min/vs/editor/editor.main.min.css`
    //   })
    //   win.document.head.appendChild(styles)
    // }
    function loadMonaco (monaco) {
        setLoading(false)
        const editor = monaco.editor.create(containerRef.current, {
          extraEditorClassName: className,
          language,
          value,
          theme,
          dimension: height && width && {height, width},
          ...options
        })
        editorDidMount(editor.getValue.bind(editor), editor, containerRef.current.childNodes[0])
    }
    if (!win.document.getElementById('monaco-script')) {
      const script = createElement('script', {
        id: 'monaco-script',
        src: `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${version}/min/vs/loader.min.js`,
        onload: () => {
          const amdLoader = win.require; // Grab Monaco's amd loader
          win.require = commonjsLoader; // Revert to commonjs
          amdLoader.config({paths: {vs: `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${version}/min/vs`}});
          amdLoader(["vs/editor/editor.main"], loadMonaco)
        }
      })
      win.document.head.appendChild(script)
    } else {
      loadMonaco(win.monaco)
    }
  }
  
  useEffect(() => () => editorRef.current?.dispose(), [])

  return (
    <div
      className={wrapperClassName}
      ref={(div) => {
        if (!div || isMounted) return
        if (popout) windowRef.current = div.ownerDocument.defaultView;
        containerRef.current = div;
        setMounted(true)
        setupMonaco()
      }}
    >
      {isLoading && loading}
    </div>
  );
};
