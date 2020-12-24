import { getModule, getModuleByDisplayName, modal } from '@vizality/webpack';

import AsyncComponent from './AsyncComponent';
import { Icons, Blacklist } from './Icon';

// --- fromProps
export const Button = AsyncComponent.fromProps(m => m.DropdownSizes);
// --- fromDisplayName
export const ApplicationStoreListingCarousel = AsyncComponent.fromDisplayName('ApplicationStoreListingCarousel');
export const ImageCarouselModal = AsyncComponent.fromDisplayName('componentDispatchSubscriber(ModalCarousel)');
export const LazyImageZoomable = AsyncComponent.fromDisplayName('LazyImageZoomable');
export const KeyboardShortcut = AsyncComponent.fromDisplayName('KeyboardShortcut');
export const KeybindRecorder = AsyncComponent.fromDisplayName('KeybindRecorder');
export const ShinyButton = AsyncComponent.fromDisplayName('ShinyButton');
export const WebhookCard = AsyncComponent.fromDisplayName('WebhookCard');
export const FormNotice = AsyncComponent.fromDisplayName('FormNotice');
export const Modal = AsyncComponent.fromDisplayName('DeprecatedModal');
export const ImageModal = AsyncComponent.fromDisplayName('ImageModal');
export const Confirm = AsyncComponent.fromDisplayName('ConfirmModal');
export const HoverRoll = AsyncComponent.fromDisplayName('HoverRoll'); // https://i.imgur.com/73wadZr.gif
export const LazyImage = AsyncComponent.fromDisplayName('LazyImage');
export const TextInput = AsyncComponent.fromDisplayName('TextInput');
export const SearchBar = AsyncComponent.fromDisplayName('SearchBar');
export const Clickable = AsyncComponent.fromDisplayName('Clickable');
export const FormTitle = AsyncComponent.fromDisplayName('FormTitle');
export const HeaderBar = AsyncComponent.fromDisplayName('HeaderBar');
export const FormText = AsyncComponent.fromDisplayName('FormText');
export const FormItem = AsyncComponent.fromDisplayName('FormItem');
export const Spinner = AsyncComponent.fromDisplayName('Spinner');
export const TabBar = AsyncComponent.fromDisplayName('TabBar');
export const Table = AsyncComponent.fromDisplayName('Table');
export const Image = AsyncComponent.fromDisplayName('Image');
export const Video = AsyncComponent.fromDisplayName('Video');
export const Card = AsyncComponent.fromDisplayName('Card');
export const Text = AsyncComponent.fromDisplayName('Text');
export const Flex = AsyncComponent.fromDisplayName('Flex');
// --- fetchFromProps
export const AdvancedScrollerThin = AsyncComponent.fetchFromProps('AdvancedScrollerThin');
export const AdvancedScrollerAuto = AsyncComponent.fetchFromProps('AdvancedScrollerAuto');
export const AdvancedScrollerNone = AsyncComponent.fetchFromProps('AdvancedScrollerNone');
export const CarouselWithPreview = AsyncComponent.fetchFromProps('CarouselWithPreview');
export const Avatar = AsyncComponent.fetchFromProps('AnimatedAvatar', 'default');
export const Helmet = AsyncComponent.fetchFromProps('HelmetProvider', 'Helmet');
export const HelmetProvider = AsyncComponent.fetchFromProps('HelmetProvider');
export const Tooltip = AsyncComponent.fetchFromProps('TooltipContainer');
// ---
export const Menu = () => null;

export { default as ComponentPreview } from './ComponentPreview';
export { default as AsyncComponent } from './AsyncComponent';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as StickyWrapper } from './StickyWrapper';
export { default as ColorPicker } from './ColorPicker';
export { default as ContextMenu } from './ContextMenu';
export { default as PopupWindow } from './PopupWindow';
export { default as ErrorState } from './ErrorState';
export { default as CodeBlock } from './CodeBlock';
export { default as Markdown } from './Markdown';
export { default as Titlebar } from './Titlebar';
export { default as Divider } from './Divider';
export { default as Switch } from './Switch';
export { default as Anchor } from './Anchor';
export { default as Icon } from './Icon';

export * as settings from './settings';
export * as misc from './misc';

// Re-export module properties
getModuleByDisplayName('FormNotice', true, true).then(FormNotice =>
  [ 'Types' ].forEach(prop => this.FormNotice[prop] = FormNotice[prop]));

getModuleByDisplayName('Spinner', true, true).then(Spinner =>
  [ 'Type' ].forEach(prop => this.Spinner[prop] = Spinner[prop]));

getModule(m => m.DropdownSizes, true, true).then(Button =>
  [ 'DropdownSizes', 'Sizes', 'Colors', 'Looks' ].forEach(prop => this.Button[prop] = Button[prop]));

getModuleByDisplayName('HeaderBar', true, true).then(HeaderBar =>
  [ 'Icon', 'Title', 'Divider' ].forEach(prop => this.HeaderBar[prop] = HeaderBar[prop]));

getModuleByDisplayName('Card', true, true).then(Card =>
  [ 'Types' ].forEach(prop => this.Card[prop] = Card[prop]));

getModuleByDisplayName('TabBar', true, true).then(TabBar =>
  [ 'Types', 'Header', 'Item', 'Separator' ].forEach(prop => this.TabBar[prop] = TabBar[prop]));

getModuleByDisplayName('SearchBar', true, true).then(SearchBar =>
  [ 'Sizes' ].forEach(prop => this.SearchBar[prop] = SearchBar[prop]));

getModuleByDisplayName('TextInput', true, true).then(TextInput =>
  [ 'Sizes' ].forEach(prop => this.TextInput[prop] = TextInput[prop]));

getModuleByDisplayName('Text', true, true).then(Text =>
  [ 'Colors', 'Family', 'Sizes', 'Weights' ].forEach(prop => this.Text[prop] = Text[prop]));

getModuleByDisplayName('Flex', true, true).then(Flex =>
  [ 'Direction', 'Justify', 'Align', 'Wrap', 'Child' ].forEach(prop => this.Flex[prop] = Flex[prop]));

getModule('AnimatedAvatar', true, true).then(Avatar =>
  [ 'Sizes' ].forEach(prop => this.Avatar[prop] = Avatar[prop]));

getModule('CarouselWithPreview', true, true).then(CarouselWithPreview =>
  [ 'Alignment' ].forEach(prop => this.CarouselWithPreview[prop] = CarouselWithPreview[prop]));

getModule('MenuGroup', true, true).then(Menu => {
  [ 'MenuCheckboxItem', 'MenuControlItem', 'MenuGroup', 'MenuItem', 'MenuRadioItem', 'MenuSeparator', 'MenuStyle' ]
    .forEach(prop => this.Menu[prop] = Menu[prop]);

  this.Menu.Menu = Menu.default;
});

getModuleByDisplayName('DeprecatedModal', true, true).then(Modal =>
  [ 'Header', 'Footer', 'Content', 'ListContent', 'CloseButton', 'Sizes' ].forEach(prop => this.Modal[prop] = Modal[prop]));

this.Confirm.defaultProps = {
  transitionState: 1,
  onClose: modal.pop
};

getModule(m => m.id && typeof m.keys === 'function' && m.keys().includes('./Activity'), true, true).then(DIcons => {
  const DiscordIcons = DIcons.keys()
    .filter(k => !k.endsWith('.tsx') && !k.endsWith('.css') && !Blacklist.includes(k))
    .map(m => m.substring(2));

  this.Icon.Icons = Icons;
  this.Icon.Blacklist = Blacklist.map(b => b.replace(/.\//g, ''));
  this.Icon.Names = [].concat(DiscordIcons, Object.keys(Icons));
});
