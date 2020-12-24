const SCSSCompiler = require('./SCSS');
const CSSCompiler = require('./CSS');
const JSXCompiler = require('./JSX');
const TSXCompiler = require('./TSX');
const JSCompiler = require('./JS');
const TSCompiler = require('./TS');

module.exports = {
  SCSS: SCSSCompiler,
  CSS: CSSCompiler,
  JSX: JSXCompiler,
  TSX: TSXCompiler,
  JS: JSCompiler,
  TS: TSCompiler,
  resolveCompiler: file => {
    switch (file.split('.').pop()) {
      case 'scss': return new SCSSCompiler(file);
      case 'css': return new CSSCompiler(file);
      case 'jsx': return new JSXCompiler(file);
      case 'tsx': return new TSXCompiler(file);
      case 'js': return new JSCompiler(file);
      case 'ts': return new TSCompiler(file);
    }
  }
};
