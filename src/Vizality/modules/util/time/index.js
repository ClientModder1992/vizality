require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });

let moment;

const time = (...args) => {
  if (!moment) moment = require('vizality/webpack').getModule('momentProperties');

  return moment(...args);
};

module.exports = time;
