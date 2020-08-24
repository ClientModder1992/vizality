const Webpack = require('@webpack');

const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const ColorPicker = AsyncComponent.from(Webpack.getModuleByDisplayName('ColorPicker', true));
const FormTitle = AsyncComponent.from(Webpack.getModuleByDisplayName('FormTitle', true));
const Slider = AsyncComponent.from(Webpack.getModuleByDisplayName('Slider', true));

module.exports = class ColorPickerInput extends Webpack.React.PureComponent {
  constructor (props) {
    super(props);
    const color = props.value || props.default || 0;
    const alpha = (color >> 24) & 255;
    this.state = {
      solid: color - alpha,
      alpha
    };
  }

  render () {
    const { children: title, note, required, default: def, defaultColors, value, disabled, transparency } = this.props;
    delete this.props.children;

    return (
      <FormItem title={title} note={note} required={required} noteHasMargin>
        <ColorPicker
          colors={defaultColors || Webpack.constants.ROLE_COLORS.map(c => c - 16777216)}
          defaultColor={def || Webpack.constants.DEFAULT_ROLE_COLOR - 16777216}
          onChange={s => this.handleChange(s, this.state.alpha)}
          disabled={disabled}
          value={value}
        />
        {transparency && this.renderOpacity()}
      </FormItem>
    );
  }

  renderOpacity () {
    const { marginTop8, marginTop20 } = Webpack.getModule('marginTop20');
    return (
      <>
        <FormTitle className={marginTop8}>Opacity</FormTitle>
        <Slider
          initialValue={100}
          className={marginTop20}
          defaultValue={this.state.alpha / 255 * 100}
          markers={[ 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 ]}
          onValueChange={a => this.handleChange(this.state.solid, a / 100 * 255)}
          onMarkerRender={s => `${s}%`}
        />
      </>
    );
  }

  handleChange (solid, alpha) {
    this.props.onChange(solid + (alpha << 24));
  }
};
