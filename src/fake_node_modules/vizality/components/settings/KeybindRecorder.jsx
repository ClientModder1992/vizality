const { React } = require('vizality/webpack');
const FormItem = require('./FormItem');

const renameKeys = Object.freeze({
  ' ': 'Space',
  Control: 'Ctrl',
  AltGraph: 'AltGr',
  ArrowUp: 'Up',
  ArrowDown: 'Down',
  ArrowLeft: 'Left',
  ArrowRight: 'Right',
  AudioVolumeUp: 'VolumeUp',
  AudioVolumeDown: 'VolumeDown',
  AudioVolumeMute: 'VolumeMute'
});

module.exports = class TextInput extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      id: `vz-kbr-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      recording: false,
      value: this.props.value,
      listeners: null
    };

    this.forceUpdate = false;
  }

  componentDidUpdate (prevProps) {
    if (this.props.value !== prevProps.value || this.forceUpdate) {
      this.forceUpdate = false;
      this.setState({ value: this.props.value });
    }
  }

  render () {
    const { Button } = require('..');
    // @todo: Make sure this component is still usable
    const className = this.state.recording ? 'vizality-keybind recording' : 'vizality-keybind';
    return (
      <FormItem title={this.props.children} note={this.props.note} required={this.props.required}>
        <div className='vizality-keybind-container'>
          <div className={className} onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            this.setRecording(!this.state.recording);
          }}>
            <div className='vizality-keybind-inner'>
              <input
                className='vizality-keybind-input'
                value={this.state.value}
                id={this.state.id}
              />
              <div className='vizality-keybind-btn'>
                <button type='button' className='vizality-keybind-button'>
                  <div className='vizality-keybind-button-inner'>
                    <span className='text'>{this.state.recording ? 'Stop Recording' : 'Edit Keybind'}</span>
                    <span className='icon' />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <Button onClick={() => this.props.onReset()}>Reset keybind</Button>
        </div>
      </FormItem>
    );
  }

  componentWillUnmount () {
    this.setRecording(false);
  }

  setRecording (recording) {
    const element = document.getElementById(this.state.id);
    if (recording && !this.state.recording) {
      const inputListener = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.repeat) {
          return;
        }

        const rawKey = e.key[0].toUpperCase() + e.key.slice(1);
        const key = renameKeys[rawKey] || rawKey;

        if ((this.state.value.match(/\+\+?/g) || []).length !== 3) {
          this.setState({ value: this.state.value === '' ? key : `${this.state.value}+${key}` });
        }

        if ((`${this.state.value}+${key}`.match(/\+\+?/g) || []).length === 3) {
          element.blur();
          this.setRecording(false);
        }
      };

      const clickListener = () => {
        this.setRecording(false);
      };

      element.focus();
      element.addEventListener('keydown', inputListener);
      window.addEventListener('click', clickListener);

      if (this.props.onRecord) {
        this.props.onRecord();
      }

      this.setState({
        recording: true,
        value: '',
        listeners: {
          input: inputListener,
          window: clickListener
        }
      });
    } else if (!recording && this.state.recording) {
      element.removeEventListener('keydown', this.state.listeners.input);
      window.removeEventListener('click', this.state.listeners.window);

      this.forceUpdate = true;
      if (this.state.value === '') {
        this.props.onReset();
      } else {
        this.props.onChange(this.state.value);
      }

      this.setState({
        recording: false,
        listeners: null
      });
    }
  }
};
