/* eslint-disable handle-callback-err */
/**
 * Discord module.
 * Contains all of the function/data that may be useful to allow
 * users and developers to interface more easily with Discord.
 * @namespace discord
 * @module discord
 * @version 0.0.1
 */

require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });

// const user = require('./user');

// const discord = {
//   user
// };

// module.exports = discord;

// const fs = require('fs');
// const path = require('path');
// const walk = (dir, done) => {
//   let results = [];
//   fs.readdir(dir, (err, list) => {
//     if (err) return done(err);
//     let i = 0;
//     (function next () {
//       let file = list[i++];
//       if (!file) return done(null, results);
//       file = path.resolve(dir, file);
//       fs.stat(file, (err, stat) => {
//         if (stat && stat.isDirectory()) {
//           walk(file, (err, res) => {
//             results = results.concat(res);
//             next();
//           });
//         } else {
//           results.push(file);
//           return next();
//         }
//       });
//     }());
//   });
// };

// walk(__dirname, (err, results) => {
//   if (err) throw err;
//   console.log(results);
// });
