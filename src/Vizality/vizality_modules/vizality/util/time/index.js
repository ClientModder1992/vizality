let momentModule;

const time = (...args) => {
  if (!momentModule) momentModule = require('vizality/webpack').getModule([ 'momentProperties' ]);

  return momentModule(...args);
};

module.exports = time;

require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
