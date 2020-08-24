const Webpack = require('@webpack');

const AsyncComponent = require('./AsyncComponent');

require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });

// Add some util components
Object.assign(exports, {
  Button: AsyncComponent.from(Webpack.getModule(m => m.DropdownSizes, true)),
  FormNotice: AsyncComponent.from(Webpack.getModuleByDisplayName('FormNotice', true)),
  Card: AsyncComponent.from(Webpack.getModuleByDisplayName('Card', true)),
  Clickable: AsyncComponent.from(Webpack.getModuleByDisplayName('Clickable', true)),
  Switch: AsyncComponent.from(Webpack.getModuleByDisplayName('Switch', true)),
  Spinner: AsyncComponent.from(Webpack.getModuleByDisplayName('Spinner', true)),
  FormTitle: AsyncComponent.from(Webpack.getModuleByDisplayName('FormTitle', true)),
  HeaderBar: AsyncComponent.from(Webpack.getModuleByDisplayName('HeaderBar', true)),
  TabBar: AsyncComponent.from(Webpack.getModuleByDisplayName('TabBar', true)),
  Text: AsyncComponent.from(Webpack.getModuleByDisplayName('Text', true)),
  Flex: AsyncComponent.from(Webpack.getModuleByDisplayName('Flex', true)),
  Tooltip: AsyncComponent.from((() => Webpack.getModule('TooltipContainer').TooltipContainer)()),
  Helmet: AsyncComponent.from((() => Webpack.getModule('HelmetProvider').Helmet)()),
  HelmetProvider: AsyncComponent.from((() => Webpack.getModule('HelmetProvider').HelmetProvider)()),
  ConfirmationModal: AsyncComponent.from(Webpack.getModuleByDisplayName('Confirm', true)),
  Modal: AsyncComponent.from(Webpack.getModuleByDisplayName('DeprecatedModal', true)),
  Menu: () => null
});

// Re-export module properties
Webpack.getModuleByDisplayName('FormNotice', true, true).then(FormNotice => {
  [ 'Types' ].forEach(prop => exports.FormNotice[prop] = FormNotice[prop]);
});
Webpack.getModule(m => m.DropdownSizes, true, true).then(Button => {
  [ 'DropdownSizes', 'Sizes', 'Colors', 'Looks' ].forEach(prop => exports.Button[prop] = Button[prop]);
});
Webpack.getModuleByDisplayName('HeaderBar', true, true).then(HeaderBar => {
  [ 'Icon', 'Title', 'Divider' ].forEach(prop => exports.HeaderBar[prop] = HeaderBar[prop]);
});
Webpack.getModuleByDisplayName('Card', true, true).then(Card => {
  [ 'Types' ].forEach(prop => exports.Card[prop] = Card[prop]);
});
Webpack.getModuleByDisplayName('TabBar', true, true).then(TabBar => {
  [ 'Types', 'Header', 'Item', 'Separator' ].forEach(prop => exports.TabBar[prop] = TabBar[prop]);
});
Webpack.getModuleByDisplayName('Text', true, true).then(Text => {
  [ 'Colors', 'Family', 'Sizes', 'Weights' ].forEach(prop => exports.Text[prop] = Text[prop]);
});
Webpack.getModuleByDisplayName('Flex', true, true).then(Flex => {
  [ 'Direction', 'Justify', 'Align', 'Wrap', 'Child' ].forEach(prop => exports.Flex[prop] = Flex[prop]);
});
Webpack.getModule('MenuGroup', true, true).then(Menu => {
  [ 'MenuCheckboxItem', 'MenuControlItem', 'MenuGroup', 'MenuItem', 'MenuRadioItem', 'MenuSeparator', 'MenuStyle' ]
    .forEach(prop => exports.Menu[prop] = Menu[prop]);
  exports.Menu.Menu = Menu.default;
});
Webpack.getModuleByDisplayName('DeprecatedModal', true, true).then(Modal => {
  [ 'Header', 'Footer', 'Content', 'LazyContent', 'CloseButton', 'Sizes' ].forEach(prop => exports.Modal[prop] = Modal[prop]);
});
Webpack.getModuleByDisplayName('Confirm', true, true).then(ConfirmationModal => {
  [ 'Sizes' ].forEach(prop => exports.ConfirmationModal[prop] = ConfirmationModal[prop]);
});
