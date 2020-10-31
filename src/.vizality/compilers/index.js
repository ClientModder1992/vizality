const CSSCompiler = require('./css');
const JsxCompiler = require('./jsx');
const ScssCompiler = require('./scss');

module.exports = {
  css: CSSCompiler,
  jsx: JsxCompiler,
  scss: ScssCompiler,
  resolveCompiler: (file) => {
    switch (file.split('.').pop()) {
      case 'jsx':
        return new JsxCompiler(file);
      case 'scss':
        return new ScssCompiler(file);
      case 'css':
        return new CSSCompiler(file);
    }
  }
};
