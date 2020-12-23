import { getModuleByDisplayName } from '@vizality/webpack';

import AsyncComponent from '../AsyncComponent';

const SwitchItem = AsyncComponent.fromDisplayName('SwitchItem');

export { default as ButtonItem } from './ButtonItem';
export { default as Category } from './Category';
export { default as Checkbox } from './Checkbox';
export { default as ColorPickerInput } from './ColorPickerInput';
export { default as CopyInput } from './CopyInput';
export { default as FormItem } from './FormItem';
export { default as FormTitle } from './FormTitle';
export { default as PermissionOverrideItem } from './PermissionOverrideItem';
export { default as RadioGroup } from './RadioGroup';
export { default as RegionSelector } from './RegionSelector';
export { default as SelectInput } from './SelectInput';
export { default as SliderInput } from './SliderInput';
export { default as TextArea } from './TextArea';
export { default as TextInput } from './TextInput';

export { SwitchItem };

// Re-export module properties
getModuleByDisplayName('SwitchItem', true, true).then(SwitchItem =>
  [ 'Sizes', 'Themes' ].forEach(prop => this.SwitchItem[prop] = SwitchItem[prop]));
