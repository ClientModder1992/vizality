const { React } = require('@vizality/react');
const { default: Editor, monaco } = require('@monaco-editor/react');
const { Spinner } = require('@vizality/components');

module.exports = React.memo(({ getSetting, toggleSetting }) => {
  monaco
    .init()
    .then(monaco => {
      monaco.editor.defineTheme('myCustomTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: '', background: '#ff0000' }
        ]
      });
    })
    .catch(error => console.error('An error occurred during initialization of Monaco: ', error));

  return (
    <>
      <button onClick={() => toggleSetting('minimap')} />
      <Editor
        height='500px'
        width='100%'
        className='vz-custom-css'
        language='scss'
        value={'i like pie'}
        theme={getSetting('minimap', 'myCustomTheme')}
        vz-editor-theme={getSetting('minimap', 'myCustomTheme')}
        loading={<Spinner/>}
        options={{
          minimap: {
            enabled: getSetting('minimap', false)
          }
        }}
      />
    </>
  );
});
