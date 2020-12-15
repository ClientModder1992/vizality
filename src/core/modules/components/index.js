const { getModule, getModuleByDisplayName, modal } = require('@vizality/webpack');

const AsyncComponent = require('./AsyncComponent');

// Add some util components
Object.assign(exports, {
  // Files
  AsyncComponent: require('./AsyncComponent'),
  CodeBlock: require('./CodeBlock'),
  ColorPicker: require('./ColorPicker'),
  ComponentPreview: require('./ComponentPreview'),
  ContextMenu:  require('./ContextMenu'),
  Divider: require('./Divider'),
  ErrorBoundary: require('./ErrorBoundary'),
  ErrorState: require('./ErrorState'),
  Icon: require('./Icon'),
  Markdown: require('./Markdown'),
  PopupWindow: require('./PopupWindow'),
  StickyWrapper: require('./StickyWrapper'),
  Switch: require('./Switch'),
  Titlebar: require('./Titlebar'),
  misc: require('./misc'),
  settings: require('./settings'),
  // -----
  Button: AsyncComponent.fromProps(m => m.DropdownSizes),
  // -----
  Table: AsyncComponent.fromDisplayName('Table'),
  HoverRoll: AsyncComponent.fromDisplayName('HoverRoll'), // https://i.imgur.com/73wadZr.gif
  ShinyButton: AsyncComponent.fromDisplayName('ShinyButton'),
  Anchor: AsyncComponent.fromDisplayName('Anchor'),
  WebhookCard: AsyncComponent.fromDisplayName('WebhookCard'),
  LazyImageZoomable: AsyncComponent.fromDisplayName('LazyImageZoomable'),
  LazyImage: AsyncComponent.fromDisplayName('LazyImage'),
  Image: AsyncComponent.fromDisplayName('Image'),
  TextInput: AsyncComponent.fromDisplayName('TextInput'),
  SearchBar: AsyncComponent.fromDisplayName('SearchBar'),
  Video: AsyncComponent.fromDisplayName('Video'),
  FormNotice: AsyncComponent.fromDisplayName('FormNotice'),
  Card: AsyncComponent.fromDisplayName('Card'),
  Clickable: AsyncComponent.fromDisplayName('Clickable'),
  Spinner: AsyncComponent.fromDisplayName('Spinner'),
  FormTitle: AsyncComponent.fromDisplayName('FormTitle'),
  HeaderBar: AsyncComponent.fromDisplayName('HeaderBar'),
  TabBar: AsyncComponent.fromDisplayName('TabBar'),
  Text: AsyncComponent.fromDisplayName('Text'),
  KeyboardShortcut: AsyncComponent.fromDisplayName('KeyboardShortcut'),
  KeybindRecorder: AsyncComponent.fromDisplayName('KeybindRecorder'),
  Flex: AsyncComponent.fromDisplayName('Flex'),
  Confirm: AsyncComponent.fromDisplayName('ConfirmModal'),
  Modal: AsyncComponent.fromDisplayName('DeprecatedModal'),
  ImageCarouselModal: AsyncComponent.fromDisplayName('componentDispatchSubscriber(ModalCarousel)'),
  ImageModal: AsyncComponent.fromDisplayName('ImageModal'),
  ApplicationStoreListingCarousel: AsyncComponent.fromDisplayName('ApplicationStoreListingCarousel'),
  // -----
  Avatar: AsyncComponent.fetchFromProps('AnimatedAvatar', 'default'),
  CarouselWithPreview: AsyncComponent.fetchFromProps('CarouselWithPreview'),
  Tooltip: AsyncComponent.fetchFromProps('TooltipContainer'),
  Helmet: AsyncComponent.fetchFromProps('HelmetProvider', 'Helmet'),
  HelmetProvider: AsyncComponent.fetchFromProps('HelmetProvider'),
  AdvancedScrollerThin: AsyncComponent.fetchFromProps('AdvancedScrollerThin'),
  AdvancedScrollerAuto: AsyncComponent.fetchFromProps('AdvancedScrollerAuto'),
  AdvancedScrollerNone: AsyncComponent.fetchFromProps('AdvancedScrollerNone'),
  // -----
  Menu: () => null
});


// Re-export module properties
getModuleByDisplayName('FormNotice', true, true).then(FormNotice =>
  [ 'Types' ].forEach(prop => exports.FormNotice[prop] = FormNotice[prop]));

getModuleByDisplayName('Spinner', true, true).then(Spinner =>
  [ 'Type' ].forEach(prop => exports.Spinner[prop] = Spinner[prop]));

getModule(m => m.DropdownSizes, true, true).then(Button =>
  [ 'DropdownSizes', 'Sizes', 'Colors', 'Looks' ].forEach(prop => exports.Button[prop] = Button[prop]));

getModuleByDisplayName('HeaderBar', true, true).then(HeaderBar =>
  [ 'Icon', 'Title', 'Divider' ].forEach(prop => exports.HeaderBar[prop] = HeaderBar[prop]));

getModuleByDisplayName('Card', true, true).then(Card =>
  [ 'Types' ].forEach(prop => exports.Card[prop] = Card[prop]));

getModuleByDisplayName('TabBar', true, true).then(TabBar =>
  [ 'Types', 'Header', 'Item', 'Separator' ].forEach(prop => exports.TabBar[prop] = TabBar[prop]));

getModuleByDisplayName('SearchBar', true, true).then(SearchBar =>
  [ 'Sizes' ].forEach(prop => exports.SearchBar[prop] = SearchBar[prop]));

getModuleByDisplayName('TextInput', true, true).then(TextInput =>
  [ 'Sizes' ].forEach(prop => exports.TextInput[prop] = TextInput[prop]));

getModuleByDisplayName('Text', true, true).then(Text =>
  [ 'Colors', 'Family', 'Sizes', 'Weights' ].forEach(prop => exports.Text[prop] = Text[prop]));

getModuleByDisplayName('Flex', true, true).then(Flex =>
  [ 'Direction', 'Justify', 'Align', 'Wrap', 'Child' ].forEach(prop => exports.Flex[prop] = Flex[prop]));

getModule('AnimatedAvatar', true, true).then(Avatar =>
  [ 'Sizes' ].forEach(prop => exports.Avatar[prop] = Avatar[prop]));

getModule('CarouselWithPreview', true, true).then(CarouselWithPreview =>
  [ 'Alignment' ].forEach(prop => exports.CarouselWithPreview[prop] = CarouselWithPreview[prop]));

getModule('MenuGroup', true, true).then(Menu => {
  [ 'MenuCheckboxItem', 'MenuControlItem', 'MenuGroup', 'MenuItem', 'MenuRadioItem', 'MenuSeparator', 'MenuStyle' ]
    .forEach(prop => exports.Menu[prop] = Menu[prop]);
  exports.Menu.Menu = Menu.default;
});

getModuleByDisplayName('DeprecatedModal', true, true).then(Modal =>
  [ 'Header', 'Footer', 'Content', 'ListContent', 'CloseButton', 'Sizes' ].forEach(prop => exports.Modal[prop] = Modal[prop]));

exports.Confirm.defaultProps = { transitionState: 1, onClose: modal.pop };
