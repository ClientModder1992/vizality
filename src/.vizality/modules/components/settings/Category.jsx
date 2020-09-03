const { getModule, getModuleByDisplayName, React } = require('@webpack');

const AsyncComponent = require('../AsyncComponent');

const DFormItem = AsyncComponent.from(getModuleByDisplayName('FormItem', true));
const FormText = AsyncComponent.from(getModuleByDisplayName('FormText', true));

let classes = {
  initialized: false,
  flexClassName: '',
  classMargins: {},
  classTitle: '',
  classDivider: '',
  classDividerDef: '',
  classDescription: ''
};

class Category extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = { classes };
  }

  async componentDidMount () {
    if (classes.initialized) {
      return;
    }

    const Flex = getModuleByDisplayName('Flex');
    classes = {
      initialized: true,

      flexClassName: `${Flex.Direction.VERTICAL} ${Flex.Justify.START} ${Flex.Align.STRETCH} ${Flex.Wrap.NO_WRAP}`,
      classMargins: getModule('marginTop20'),
      classTitle: getModule('titleDefault').titleDefault,
      classDivider: getModule(m => Object.keys(m).join('') === 'divider').divider,
      classDividerDef: getModule('dividerDefault').dividerDefault,
      classDescription: getModule('formText', 'description').description
    };

    this.setState({ classes });
  }

  render () {
    return (
      <DFormItem className={`vizality-settings-item vizality-category ${classes.flexClassName} ${classes.classMargins.marginBottom20}`}>
        <div className='vizality-settings-item-title' onClick={() => this.props.onChange(!this.props.opened)}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className={this.props.opened ? 'opened' : ''}>
            <path
              fill='var(--header-primary)'
              d='M9.29 15.88L13.17 12 9.29 8.12c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3c-.39.39-1.02.39-1.41 0-.38-.39-.39-1.03 0-1.42z' />
          </svg>
          <div>
            <div className={classes.classTitle}>
              {this.props.name}
            </div>
            <FormText className={classes.classDescription}>
              {this.props.description}
            </FormText>
          </div>
        </div>
        {this.props.opened
          ? <div className='vizality-settings-item-inner'>
            {this.props.children}
          </div>
          : <div className={`${classes.classDivider} ${classes.classDividerDef}`} />}

      </DFormItem>
    );
  }
}

module.exports = Category;
