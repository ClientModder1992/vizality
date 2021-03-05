import { getModule, getModuleByDisplayName, modal } from '@vizality/webpack';

import AsyncComponent from './AsyncComponent';
import { Icons } from './Icon';

// --- fromProps
export const Button = AsyncComponent.fromProps(m => m.DropdownSizes);
// --- fromDisplayName
export const ApplicationStoreListingCarousel = AsyncComponent.fromDisplayName('ApplicationStoreListingCarousel');
export const ImageCarouselModal = AsyncComponent.fromDisplayName('componentDispatchSubscriber(ModalCarousel)');
export const GIFPickerSearchResults = AsyncComponent.fromDisplayName('GIFPickerSearchResults');
export const HeaderBarContainer = AsyncComponent.fromDisplayName('HeaderBarContainer');
export const LazyImageZoomable = AsyncComponent.fromDisplayName('LazyImageZoomable');
export const KeyboardShortcut = AsyncComponent.fromDisplayName('KeyboardShortcut');
export const KeybindRecorder = AsyncComponent.fromDisplayName('KeybindRecorder');
export const UserPopout = AsyncComponent.fromDisplayName('ConnectedUserPopout');
export const Autocomplete = AsyncComponent.fromDisplayName('Autocomplete');
export const UserProfile = AsyncComponent.fromDisplayName('UserProfile');
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
export const Text = AsyncComponent.fromDisplayName('Text'); // "className", "color", "size", "tag", "selectable", "children", "style", "aria-label"
export const Flex = AsyncComponent.fromDisplayName('Flex');
// --- fetchFromProps
export const AdvancedScrollerThin = AsyncComponent.fetchFromProps('AdvancedScrollerThin');
export const AdvancedScrollerAuto = AsyncComponent.fetchFromProps('AdvancedScrollerAuto');
export const AdvancedScrollerNone = AsyncComponent.fetchFromProps('AdvancedScrollerNone');
export const CarouselWithPreview = AsyncComponent.fetchFromProps('CarouselWithPreview');
export const Avatar = AsyncComponent.fetchFromProps('AnimatedAvatar', 'default');
export const ContextMenu = AsyncComponent.fetchFromProps('MenuGroup', 'default');
export const Helmet = AsyncComponent.fetchFromProps('HelmetProvider', 'Helmet');
export const HelmetProvider = AsyncComponent.fetchFromProps('HelmetProvider');
export const Tooltip = AsyncComponent.fetchFromProps('TooltipContainer');
export const SlideIn = AsyncComponent.fetchFromProps('SlideIn');

export { default as ComponentPreview } from './ComponentPreview';
export { default as AsyncComponent } from './AsyncComponent';
export { default as DeferredRender } from './DeferredRender';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as StickyWrapper } from './StickyWrapper';
export { default as ColorPicker } from './ColorPicker';
export { default as PopupWindow } from './PopupWindow';
export { default as Editor } from './Editor';
export { default as ErrorState } from './ErrorState';
export { default as CodeBlock } from './CodeBlock';
export { default as Markdown } from './Markdown';
export { default as Titlebar } from './Titlebar';
export { default as Divider } from './Divider';
// export { default as Sticker } from './Sticker';
export { default as Switch } from './Switch';
export { default as Anchor } from './Anchor';
// export { default as Emote } from './Emote';
export { default as Icon } from './Icon';

export * as settings from './settings';
export * as misc from './misc';

/**
 * Re-export module properties
 * ---
 */
getModuleByDisplayName('FormNotice', true, true).then(FormNotice => {
  this.FormNotice.Types = FormNotice.Types;
});

getModuleByDisplayName('Spinner', true, true).then(Spinner => {
  this.Spinner.Types = Spinner.Type;
});

getModule(m => m.DropdownSizes, true, true).then(Button => {
  this.Button.DropdownSizes = Button.DropdownSizes;
  this.Button.Colors = Button.Colors;
  this.Button.Looks = Button.Looks;
  this.Button.Sizes = Button.Sizes;
});

getModule(m => m.default?.displayName === 'Tooltip', true, true).then(Tooltip => {
  this.Tooltip.Positions = Tooltip.TooltipPositions;
  this.Tooltip.Colors = Tooltip.TooltipColors;
});

getModuleByDisplayName('HeaderBar', true, true).then(HeaderBar => {
  this.HeaderBar.Divider = HeaderBar.Divider;
  this.HeaderBar.Title = HeaderBar.Title;
  this.HeaderBar.Icon = HeaderBar.Icon;
});

getModuleByDisplayName('Card', true, true).then(Card => {
  this.Card.Types = Card.Types;
});

getModuleByDisplayName('TabBar', true, true).then(TabBar => {
  this.TabBar.Separator = TabBar.Separator;
  this.TabBar.Header = TabBar.Header;
  this.TabBar.Types = TabBar.Types;
  this.TabBar.Item = TabBar.Item;
});

getModuleByDisplayName('SearchBar', true, true).then(SearchBar => {
  this.SearchBar.Sizes = SearchBar.Sizes;
});

getModuleByDisplayName('TextInput', true, true).then(TextInput => {
  this.TextInput.Sizes = TextInput.Sizes;
});

getModuleByDisplayName('Text', true, true).then(Text => {
  this.Text.Colors = Text.Colors;
  this.Text.Sizes = Text.Sizes;
});

getModuleByDisplayName('Flex', true, true).then(Flex => {
  this.Flex.defaultProps = Flex.defaultProps;
  this.Flex.Direction = Flex.Direction;
  this.Flex.Justify = Flex.Justify;
  this.Flex.Align = Flex.Align;
  this.Flex.Child = Flex.Child;
  this.Flex.Wrap = Flex.Wrap;
});

getModule('AnimatedAvatar', true, true).then(Avatar => {
  this.Avatar.Sizes = Avatar.Sizes;
});

getModule('CarouselWithPreview', true, true).then(CarouselWithPreview => {
  this.CarouselWithPreview.Alignment = CarouselWithPreview.Alignment;
});

getModule('MenuGroup', true, true).then(ContextMenu => {
  this.ContextMenu.CheckboxItem = ContextMenu.MenuCheckboxItem;
  this.ContextMenu.ControlItem = ContextMenu.MenuControlItem;
  this.ContextMenu.RadioItem = ContextMenu.MenuRadioItem;
  this.ContextMenu.Separator = ContextMenu.MenuSeparator;
  this.ContextMenu.Group = ContextMenu.MenuGroup;
  this.ContextMenu.Style = ContextMenu.MenuStyle;
  this.ContextMenu.Item = ContextMenu.MenuItem;
  this.ContextMenu.Menu = ContextMenu.default;
});

getModuleByDisplayName('DeprecatedModal', true, true).then(Modal => {
  this.Modal.ListContent = Modal.ListContent;
  this.Modal.CloseButton = Modal.CloseButton;
  this.Modal.Content = Modal.Content;
  this.Modal.Header = Modal.Header;
  this.Modal.Footer = Modal.Footer;
  this.Modal.Sizes = Modal.Sizes;
});

this.Confirm.defaultProps = {
  transitionState: 1,
  onClose: modal.pop
};

this.Icon.Icons = Icons;
this.Icon.Names = Object.keys(Icons);

export default this;
