const { getModuleByDisplayName } = require('@vizality/webpack');

const AsyncComponent = require('../AsyncComponent');

Object.assign(exports, {
  ButtonItem: require('./ButtonItem'),
  Category: require('./Category'),
  Checkbox: require('./Checkbox'),
  ColorPickerInput: require('./ColorPickerInput'),
  CopyInput: require('./CopyInput'),
  FormItem: require('./FormItem'),
  FormTitle: require('./FormTitle'),
  PermissionOverrideItem: require('./PermissionOverrideItem'),
  RadioGroup: require('./RadioGroup'),
  RegionSelector: require('./RegionSelector'),
  SelectInput: require('./SelectInput'),
  SliderInput: require('./SliderInput'),
  TextArea: require('./TextArea'),
  TextInput: require('./TextInput')
});

// Add some util components
Object.assign(exports, {
  SwitchItem: AsyncComponent.from(getModuleByDisplayName('SwitchItem', true))
});

// Re-export module properties
getModuleByDisplayName('SwitchItem', true, true).then(SwitchItem =>
  [ 'Sizes', 'Themes' ].forEach(prop => exports.SwitchItem[prop] = SwitchItem[prop])
);

// const { getModuleByDisplayName } = require('@vizality/webpack');

// const AsyncComponent = require('../AsyncComponent');

// require('fs')
//   .readdirSync(__dirname)
//   .filter(file => file !== 'index.js')
//   .forEach(filename => {
//     const moduleName = filename.split('.')[0];
//     exports[moduleName] = require(`${__dirname}/${filename}`);
//   });

// // Add some util components
// Object.assign(exports, {
//   SwitchItem: AsyncComponent.from(getModuleByDisplayName('SwitchItem', true))
// });

// // Re-export module properties
// (async () => {
//   const SwitchItem = await getModuleByDisplayName('SwitchItem', true, true);
//   [ 'Sizes', 'Themes' ].forEach(prop => exports.SwitchItem[prop] = SwitchItem[prop]);
// })();
