const { getModule, getModuleByDisplayName } = require('vizality/webpack');
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
  Button: AsyncComponent.from(getModule(m => m.DropdownSizes)),
  FormNotice: AsyncComponent.from(getModuleByDisplayName('FormNotice')),
  Card: AsyncComponent.from(getModuleByDisplayName('Card')),
  Clickable: AsyncComponent.from(getModuleByDisplayName('Clickable')),
  Switch: AsyncComponent.from(getModuleByDisplayName('Switch')),
  Spinner: AsyncComponent.from(getModuleByDisplayName('Spinner')),
  FormTitle: AsyncComponent.from(getModuleByDisplayName('FormTitle')),
  HeaderBar: AsyncComponent.from(getModuleByDisplayName('HeaderBar')),
  TabBar: AsyncComponent.from(getModuleByDisplayName('TabBar')),
  Text: AsyncComponent.from(getModuleByDisplayName('Text')),
  Flex: AsyncComponent.from(getModuleByDisplayName('Flex')),
  Tooltip: AsyncComponent.from((async () => (await getModule([ 'TooltipContainer' ])).TooltipContainer)()),
  Helmet: AsyncComponent.from((async () => (await getModule([ 'HelmetProvider' ])).Helmet)()),
  HelmetProvider: AsyncComponent.from((async () => (await getModule([ 'HelmetProvider' ])).HelmetProvider)()),
  ConfirmationModal: AsyncComponent.from(getModuleByDisplayName('Confirm')),
  Modal: AsyncComponent.from(getModuleByDisplayName('DeprecatedModal')),
  Menu: () => null
});

// Re-export module properties
getModuleByDisplayName('FormNotice', true, true).then(FormNotice => {
  [ 'Types' ].forEach(prop => exports.FormNotice[prop] = FormNotice[prop]);
});
getModule(m => m.DropdownSizes, true, true).then(Button => {
  [ 'DropdownSizes', 'Sizes', 'Colors', 'Looks' ].forEach(prop => exports.Button[prop] = Button[prop]);
});
getModuleByDisplayName('HeaderBar', true, true).then(HeaderBar => {
  [ 'Icon', 'Title', 'Divider' ].forEach(prop => exports.HeaderBar[prop] = HeaderBar[prop]);
});
getModuleByDisplayName('Card', true, true).then(Card => {
  [ 'Types' ].forEach(prop => exports.Card[prop] = Card[prop]);
});
getModuleByDisplayName('TabBar', true, true).then(TabBar => {
  [ 'Types', 'Header', 'Item', 'Separator' ].forEach(prop => exports.TabBar[prop] = TabBar[prop]);
});
getModuleByDisplayName('Text', true, true).then(Text => {
  [ 'Colors', 'Family', 'Sizes', 'Weights' ].forEach(prop => exports.Text[prop] = Text[prop]);
});
getModuleByDisplayName('Flex', true, true).then(Flex => {
  [ 'Direction', 'Justify', 'Align', 'Wrap', 'Child' ].forEach(prop => exports.Flex[prop] = Flex[prop]);
});
getModule([ 'MenuGroup' ]).then(Menu => {
  [ 'MenuCheckboxItem', 'MenuControlItem', 'MenuGroup', 'MenuItem', 'MenuRadioItem', 'MenuSeparator', 'MenuStyle' ]
    .forEach(prop => exports.Menu[prop] = Menu[prop]);
  exports.Menu.Menu = Menu.default;
});
getModuleByDisplayName('DeprecatedModal', true, true).then(Modal => {
  [ 'Header', 'Footer', 'Content', 'LazyContent', 'CloseButton', 'Sizes' ].forEach(prop => exports.Modal[prop] = Modal[prop]);
});
getModuleByDisplayName('Confirm', true, true).then(ConfirmationModal => {
  [ 'Sizes' ].forEach(prop => exports.ConfirmationModal[prop] = ConfirmationModal[prop]);
});
