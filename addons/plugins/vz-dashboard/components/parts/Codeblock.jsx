const { getModule, getModules } = require('@webpack');
const { React } = require('@react');

const handleCodeCopy = (e) => {
  vizality.manager.plugins.get('vz-codeblocks')._onClickHandler(e);
};

/**
 * 
 * @note Can't be an arrow function or we lose this `this` context.
 * @param {*} type
 * @param {*} content
 * @returns {*}
 */
function getCodeblock (type, content) {
  return React.createElement('div', {
    dangerouslySetInnerHTML: {
      __html: getModules([ 'highlight' ])[4].highlight(type, content).value
    }
  });
}

module.exports = React.memo(({ type, content }) => {
  const { markup } = getModule('markup');
  const { marginBottom20 } = getModule('marginBottom20');
  const ogType = type;
  type = type === 'React' ? 'js' : type;

  return (
    <pre className={`${markup} ${marginBottom20}`}>
      <code className={`hljs ${type}`}>
        {getCodeblock(type, content)}
        <div className='vizality-codeblock-lang'>{ogType}</div>
        <div className='vizality-lines'/>
        <button className='vizality-codeblock-copy-btn' onClick={handleCodeCopy}>copy</button>
      </code>
    </pre>
  );
});
