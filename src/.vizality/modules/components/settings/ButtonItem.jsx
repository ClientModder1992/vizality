const Webpack = require('@webpack');

const AsyncComponent = require('../AsyncComponent');

const DFormItem = AsyncComponent.from(Webpack.getModuleByDisplayName('FormItem', true));
const FormText = AsyncComponent.from(Webpack.getModuleByDisplayName('FormText', true));
const Tooltip = AsyncComponent.from(Webpack.getModuleByDisplayName('Tooltip', true));

let classes = {
  initialized: false,
  flexClassName: '',
  classMargins: {},
  classTitle: '',
  classDivider: '',
  classDividerDef: '',
  classDescription: ''
};

module.exports = class ButtonItem extends Webpack.React.PureComponent {
  constructor () {
    super();
    this.state = { classes };
  }

  async componentWillMount () {
    if (classes.initialized) return;

    const Flex = Webpack.getModuleByDisplayName('Flex');
    classes = {
      initialized: true,

      flexClassName: `${Flex.Direction.VERTICAL} ${Flex.Justify.START} ${Flex.Align.STRETCH} ${Flex.Wrap.NO_WRAP}`,
      classMargins: Webpack.getModule('marginTop20'),
      classTitle: Webpack.getModule('titleDefault').titleDefault,
      classDivider: Webpack.getModule(m => Object.keys(m).join('') === 'divider').divider,
      classDividerDef: Webpack.getModule('dividerDefault').dividerDefault,
      classDescription: Webpack.getModule('formText', 'description').description
    };

    this.setState({ classes });
  }

  render () {
    const { Button } = require('..');
    return <DFormItem
      className={`vizality-settings-item vizality-button-item ${this.state.classes.flexClassName} ${this.state.classes.classMargins.marginBottom20}`}>
      <div className='vizality-settings-item-title'>
        <div>
          <div className={this.state.classes.classTitle}>
            {this.props.children}
          </div>
          <FormText className={this.state.classes.classDescription}>
            {this.props.note}
          </FormText>
        </div>
        <Tooltip
          text={this.props.tooltipText}
          position={this.props.tooltipPosition}
          shouldShow={Boolean(this.props.tooltipText)}
        >
          {() => (
            <Button
              color={this.props.success ? Button.Colors.GREEN : this.props.color || Button.Colors.BRAND}
              disabled={this.props.disabled}
              onClick={() => this.props.onClick()}
              style={{ marginLeft: 5 }}
            >
              {this.props.button}
            </Button>
          )}
        </Tooltip>
      </div>
      <div className={`${classes.classDivider} ${classes.classDividerDef}`} />
    </DFormItem>;
  }
};