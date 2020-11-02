const { getModule, getModuleByDisplayName, modal } = require('@webpack');

const AsyncComponent = require('./AsyncComponent');

require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });

/*
 * @todo: Possibly provide this as a utility, because Discord is starting to love
 * using this pattern. Maybe as a part of AsyncComponent?
 */
const fetchByProp = async (prop, propName) => {
  const mdl = await getModule(prop, true);
  return mdl[propName || prop];
};

// Add some util components
Object.assign(exports, {
  Button: AsyncComponent.from(getModule(m => m.DropdownSizes, true)),
  LazyImageZoomable: AsyncComponent.from(getModuleByDisplayName('LazyImageZoomable', true)),
  Image: AsyncComponent.from(getModuleByDisplayName('Image', true)),
  Video: AsyncComponent.from(getModuleByDisplayName('Video', true)),
  FormNotice: AsyncComponent.from(getModuleByDisplayName('FormNotice', true)),
  Card: AsyncComponent.from(getModuleByDisplayName('Card', true)),
  Clickable: AsyncComponent.from(getModuleByDisplayName('Clickable', true)),
  Spinner: AsyncComponent.from(getModuleByDisplayName('Spinner', true)),
  FormTitle: AsyncComponent.from(getModuleByDisplayName('FormTitle', true)),
  HeaderBar: AsyncComponent.from(getModuleByDisplayName('HeaderBar', true)),
  TabBar: AsyncComponent.from(getModuleByDisplayName('TabBar', true)),
  Text: AsyncComponent.from(getModuleByDisplayName('Text', true)),
  Flex: AsyncComponent.from(getModuleByDisplayName('Flex', true)),
  Tooltip: AsyncComponent.from((() => getModule('TooltipContainer').TooltipContainer)()),
  Helmet: AsyncComponent.from((() => getModule('HelmetProvider').Helmet)()),
  HelmetProvider: AsyncComponent.from((() => getModule('HelmetProvider').HelmetProvider)()),
  Confirm: AsyncComponent.from(getModuleByDisplayName('ConfirmModal', true)),
  Modal: AsyncComponent.from(getModuleByDisplayName('DeprecatedModal', true)),
  ImageCarouselModal: AsyncComponent.from(getModuleByDisplayName('componentDispatchSubscriber(ModalCarousel)', true)),
  ImageModal: AsyncComponent.from(getModuleByDisplayName('ImageModal', true)),
  AdvancedScrollerThin: AsyncComponent.from(fetchByProp('AdvancedScrollerThin')),
  AdvancedScrollerAuto: AsyncComponent.from(fetchByProp('AdvancedScrollerAuto')),
  AdvancedScrollerNone: AsyncComponent.from(fetchByProp('AdvancedScrollerNone')),
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
getModule('MenuGroup', true, true).then(Menu => {
  [ 'MenuCheckboxItem', 'MenuControlItem', 'MenuGroup', 'MenuItem', 'MenuRadioItem', 'MenuSeparator', 'MenuStyle' ]
    .forEach(prop => exports.Menu[prop] = Menu[prop]);
  exports.Menu.Menu = Menu.default;
});
getModuleByDisplayName('DeprecatedModal', true, true).then(Modal => {
  [ 'Header', 'Footer', 'Content', 'ListContent', 'CloseButton', 'Sizes' ].forEach(prop => exports.Modal[prop] = Modal[prop]);
});
exports.Confirm.defaultProps = {
  transitionState: 1,
  onClose: modal.pop
};
