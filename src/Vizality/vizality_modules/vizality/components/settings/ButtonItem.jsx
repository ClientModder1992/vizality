const { getModule, getModuleByDisplayName, React } = require('vizality/webpack');
const AsyncComponent = require('../AsyncComponent');

const DFormItem = AsyncComponent.from(getModuleByDisplayName('FormItem'));
const FormText = AsyncComponent.from(getModuleByDisplayName('FormText'));
const Tooltip = AsyncComponent.from(getModuleByDisplayName('Tooltip'));

let classes = {
  initialized: false,
  flexClassName: '',
  classMargins: {},
  classTitle: '',
  classDivider: '',
  classDividerDef: '',
  classDescription: ''
};

module.exports = class ButtonItem extends React.PureComponent {
  constructor () {
    super();

    this.state = { classes };
  }

  async componentDidMount () {
    if (classes.initialized) return;

    const Flex = await getModuleByDisplayName('Flex');
    classes = {
      initialized: true,

      flexClassName: `${Flex.Direction.VERTICAL} ${Flex.Justify.START} ${Flex.Align.STRETCH} ${Flex.Wrap.NO_WRAP}`,
      classMargins: await getModule([ 'marginTop20' ]),
      classTitle: (await getModule([ 'titleDefault' ])).titleDefault,
      classDivider: (await getModule(m => Object.keys(m).join('') === 'divider')).divider,
      classDividerDef: (await getModule([ 'dividerDefault' ])).dividerDefault,
      classDescription: (await getModule([ 'formText', 'description' ])).description
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
