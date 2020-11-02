const { getModule, getModuleByDisplayName } = require('@webpack');
const { React } = require('@react');

const AsyncComponent = require('../AsyncComponent');

const DFormItem = AsyncComponent.from(getModuleByDisplayName('FormItem', true));
const FormText = AsyncComponent.from(getModuleByDisplayName('FormText', true));
const Tooltip = AsyncComponent.from(getModuleByDisplayName('Tooltip', true));

let classes = {
  initialized: false,
  flexClassName: '',
  classMargins: {},
  classDivider: '',
  classDividerDef: '',
  classesLabel: {}
};

module.exports = class ButtonItem extends React.PureComponent {
  constructor () {
    super();
    this.state = { classes };
  }

  async componentWillMount () {
    if (classes.initialized) return;

    const Flex = getModuleByDisplayName('Flex');
    classes = {
      initialized: true,

      flexClassName: `${Flex.Direction.VERTICAL} ${Flex.Justify.START} ${Flex.Align.STRETCH} ${Flex.Wrap.NO_WRAP}`,
      classMargins: getModule('marginTop20'),
      classDivider: getModule(m => Object.keys(m).join('') === 'divider').divider,
      classDividerDef: getModule('dividerDefault').dividerDefault,
      classDescription: getModule('formText', 'description').description,
      classesLabel: getModule('labelRow')
    };

    this.setState({ classes });
  }

  render () {
    const { Button } = require('..');
    return <DFormItem
      className={`vizality-settings-item vizality-button-item ${this.state.classes.flexClassName} ${this.state.classes.classMargins.marginBottom20}`}>
      <div className='vizality-settings-item-title'>
        <div>
          <div className={this.state.classes.classesLabel.labelRow}>
            <label class={this.state.classes.classesLabel.title}>
              {this.props.children}
            </label>
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
