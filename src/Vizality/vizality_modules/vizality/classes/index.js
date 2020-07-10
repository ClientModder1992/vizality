require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });

const components = require('./components');
const layout = require('./layout');
const views = require('./views');
const plugins = require('./plugins');
const vizality = require('./vizality');

const classes = {
  components,
  layout,
  views,
  plugins,
  vizality
};

exports = classes;
