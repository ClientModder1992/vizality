import React, { memo, useState } from 'react';

import { getModule, constants } from '@vizality/webpack';

import AsyncComponent from '../AsyncComponent';
import { ColorPicker, FormTitle } from '..';
import FormItem from './FormItem';

const Slider = AsyncComponent.fromDisplayName('Slider');

const { DEFAULT_ROLE_COLOR, ROLE_COLORS } = constants;

export default memo(props => {
  const { title, note, required, defaultColors, disabled, onChange, transparency, value, default: def } = props;
  delete props.children;

  const color = value || def || 0;
  const [ alpha ] = useState((color >> 24) & 255);
  const [ solid ] = useState(color - alpha);

  const renderOpacity = () => {
    const { marginTop8, marginTop20 } = getModule('marginTop20');
    return (
      <>
        <FormTitle className={marginTop8}>Opacity</FormTitle>
        <Slider
          initialValue={100}
          className={marginTop20}
          defaultValue={alpha / 255 * 100}
          markers={[ 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 ]}
          onValueChange={a => this.handleChange(solid, a / 100 * 255)}
          onMarkerRender={s => `${s}%`}
        />
      </>
    );
  };

  const handleChange = (solid, alpha) => {
    onChange(solid + (alpha << 24));
  };

  return (
    <FormItem title={title} note={note} required={required} noteHasMargin>
      <ColorPicker
        colors={defaultColors || ROLE_COLORS}
        defaultColor={typeof def === 'number' ? def : DEFAULT_ROLE_COLOR}
        onChange={s => onChange(s)}
        disabled={disabled}
        value={value}
      />
      {/* transparency && renderOpacity() */}
    </FormItem>
  );
});
