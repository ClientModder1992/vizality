const { clipboard } = require('electron');

const { settings: { TextInput, SwitchItem, Category, RadioGroup, SelectInput, ColorPickerInput, CopyInput, TextArea, RegionSelector, SliderInput, PermissionOverrideItem } } = require('@components');
const { getModule, getModuleByDisplayName } = require('@webpack');
const { sleep } = require('@util');
const { React } = require('@react');

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
      copyInput: {
        mode: getModule(m => m.default && m.default.Modes).default.Modes.DEFAULT,
        text: 'Copy'
      },
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

        <SelectInput
          note={'This is a select input.'}
          value={getSetting('cm-font-family', 'monaco')}
          options={[
            {
              value: 'monaco',
              label: 'Monaco'
            },
            {
              value: 'hack',
              label: 'Hack'
            },
            {
              value: 'inconsolata',
              label: 'Inconsolata'
            },
            {
              value: 'source-code-pro',
              label: 'Source Code Pro'
            }
          ]}
          onChange={res => {
            updateSetting('cm-font-family', res.value);
          }}
        >
Font Family
        </SelectInput>

        {/* <ColorPickerInput
          colors={[ 1752220, 3066993, 3447003, 10181046, 15277667, 15844367, 15105570, 15158332, 9807270, 6323595, 1146986, 2067276, 2123412, 7419530, 11342935, 12745742, 11027200, 10038562, 9936031, 5533306 ]}
          defaultColor={10070709}
          value={getSetting('cake')}
          onChange={res => {
            updateSetting('cake', res);
          }}
        >
Just a simple color picker.
        </ColorPickerInput> */}
        <ColorPickerInput
          defaultColors={[ 1752220, 3066993, 3447003, 10181046, 15277667, 15844367, 15105570, 15158332, 9807270, 6323595, 1146986, 2067276, 2123412, 7419530, 11342935, 12745742, 11027200, 10038562, 9936031, 5533306 ]}
          def={10070709}
          value={getSetting('cake')}
          onChange={res => {
            updateSetting('cake', res);
          }}
        >
Just a simple color picker.
        </ColorPickerInput>
        <div className='pie'
          style={{
            height: 50,
            width: 50,
            marginBottom: 20,
            borderRadius: 1000,
            backgroundColor: getModule('int2hex', 'getDarkness', 'isValidHex').int2hex(getSetting('cake'))
          }}>
        </div>

        {/* <CopyInput
          value={'Just some more pie'}
          mode={this.state.copyInput.mode}
          text={this.state.copyInput.text}
          onCopy={async val => {
            // For some reason, this selects the text in the input so let's clear the selection
            window.getSelection().removeAllRanges();

            clipboard.writeText(val);

            window.getSelection().removeAllRanges();

            const modeModule = (await getModule(m => m.default && m.default.Modes)).default.Modes;
            this.setState(state => state.copyInput.mode = modeModule.SUCCESS);
            this.setState(state => state.copyInput.text = 'Copied');
            await sleep(300);
            this.setState(state => state.copyInput.mode = modeModule.DEFAULT);
            this.setState(state => state.copyInput.text = 'Copy');
          }}
        >
Just a simple copy input.
        </CopyInput> */}

        <TextArea
          autofocus={false}
          autosize={false}
          disabled={false}
          flex={false}
          maxLength={120}
          name={''}
          onChange={val => {
            updateSetting('textarea-test', val);
            val -= getSetting('textarea-test').length;
          }}
          placeholder={'The best placeholder you ever saw'}
          resizeable={false}
          rows={3}
          value={getSetting('textarea-test')}
        >
Just a simple textarea.
        </TextArea>

        <div className={classes.flexClassName}>
          <div className={getModule('flexChild')} style={{ flex: '1 1 50%' }}>
            <SelectInput
              note={'This is a select input.'}
              value={getSetting('cm-font-family', 'monaco')}
              options={[
                {
                  value: 'monaco',
                  label: 'Monaco'
                },
                {
                  value: 'hack',
                  label: 'Hack'
                },
                {
                  value: 'inconsolata',
                  label: 'Inconsolata'
                },
                {
                  value: 'source-code-pro',
                  label: 'Source Code Pro'
                }
              ]}
              onChange={res => {
                updateSetting('cm-font-family', res.value);
              }}
            >
    Font Family
            </SelectInput>
          </div>
          <div className={getModule('flexChild')} style={{ flex: '1 1 50%' }}>
            <SelectInput
              note={'This is a select input.'}
              value={getSetting('cm-font-family', 'monaco')}
              options={[
                {
                  value: 'monaco',
                  label: 'Monaco'
                },
                {
                  value: 'hack',
                  label: 'Hack'
                },
                {
                  value: 'inconsolata',
                  label: 'Inconsolata'
                },
                {
                  value: 'source-code-pro',
                  label: 'Source Code Pro'
                }
              ]}
              onChange={res => {
                updateSetting('cm-font-family', res.value);
              }}
            >
    Font Family
            </SelectInput>
          </div>
        </div>

        <SliderInput
          disabled={false}
          note={'This is a slider input.'}
          stickToMarkers
          initialValue={15}
          markers={[ 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 26 ]}
          onMarkerRender={s => `${s}px`}
          defaultValue={getSetting('cm-fontSize', 15)}
          onChange={v => {
            updateSetting('cm-fontSize', v);
          }}
        >
Font Size
        </SliderInput>
        {/* <Checkbox
          // eslint-disable-next-line multiline-comment-style
          // align={'alignCenter-MrlN6q'}
          // color={'#7289da'}
          text={'is it working'}
          disabled={false}
          onChange={() => {
            toggleSetting('checkbox-test');
          }}
          readOnly={false}
          reverse={false}
          // shape={'box-mmYMsp'}
          size={24}
          type={'inverted'}
          value={getSetting('checkbox-test')}
        >
Just a simple checkbox.
        </Checkbox> */}

        {/* <RegionSelector
          disabled={false}
          error={false}
          onClick={ret => {
            console.log(ret);
            getModule('RegionSelectModal')({
              onChange (...args) {
                console.log(args);
              }
            });
          }}
          region={{
            custom: false,
            deprecated: false,
            id: 'us-south',
            name: 'US South',
            optimal: true,
            vip: false
          }}
        >
Just a simple region selector.
        </RegionSelector>

        <PermissionOverrideItem
          disabled={false}
          hideBorder={false} // divider
          note={'Members with this permission can change the channel\'s name or delete it.'}
          onChange={''}
          value={'ALLOW'} // 'DENY', 'ALLOW', 'PASSTHROUGH'
        >
Just a simple permission override item.
        </PermissionOverrideItem> */}
      </div>
    );
  }
};
