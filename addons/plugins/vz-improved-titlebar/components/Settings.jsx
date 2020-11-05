const { settings: { TextInput, SwitchItem, Category, RadioGroup } } = require('@vizality/components');
const { getModuleByDisplayName } = require('@vizality/webpack');
const { React } = require('@vizality/react');

let classes = {
  initialized: false,
  flexClassName: '',
  classModule: {},
  classDivider: '',
  classDividerDef: '',
  formModule: {}
};

module.exports = class Settings extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      classes
    };
  }

  // eslint-disable-next-line no-empty-function
  async componentDidMount () {
    if (classes.initialized) {
      return;
    }

    const Flex = getModuleByDisplayName('Flex');
    classes = {
      initialized: true,

      flexClassName: `${Flex.Direction.HORIZONTAL} ${Flex.Justify.START} ${Flex.Align.STRETCH} ${Flex.Wrap.NO_WRAP}`
    };

    this.setState({ classes });
  }

  render () {
    const { getSetting, updateSetting, toggleSetting } = this.props;
    return (
      <div className='advanced-titlebar'>
        <Category
          name={'Titlebar Header'}
          description={'Some options for displaying text in the top left of the titlebar.'}
          opened={getSetting('header', false)}
          onChange={() => toggleSetting('header')}
        >
          <SwitchItem
            note='Show the titlebar header text in the upper left corner.'
            value={getSetting('showHeader', true)}
            onChange={() => {
              toggleSetting('showHeader');
            }}
          >
            Show titlebar header text
          </SwitchItem>

          <TextInput
            note='Change the titlebar header text.'
            defaultValue={getSetting('headerText', 'Discord')}
            required={false}
            disabled={!getSetting('showHeader', true)}
            onChange={val => {
              updateSetting('headerText', val);
            }}
          >
            Titlebar header text
          </TextInput>

          {/* @TODO: Implement this
            <SwitchItem
              note='Choose a font for the titlebar header text.'
              value={getSetting('headerFont', true)}
              onChange={() => toggleSetting('headerFont')}
            >
              Titlebar header text font
            </SwitchItem> */}
        </Category>

        <RadioGroup
          required={false}
          onChange={val => {
            updateSetting('type', val.value);
          }}
          value={getSetting('type', 'windows')}
          options={[
            {
              name: 'Windows',
              value: 'windows'
            },
            {
              name: 'Mac',
              value: 'mac'
            },
            {
              name: 'None',
              value: 'none',
              desc: 'Forcefully remove the titlebar.'
            }
          ]}
        >
          Titlebar Style
        </RadioGroup>

        <SwitchItem
          note='Shows forward, back, and refresh buttons in the top left.'
          value={getSetting('showExtras', false)}
          onChange={() => {
            toggleSetting('showExtras');
          }}
        >
          Extra buttons
        </SwitchItem>
      </div>
    );
  }
};
