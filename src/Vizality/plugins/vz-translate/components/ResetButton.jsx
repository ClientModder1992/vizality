const { React, getModule, getModuleByDisplayName } = require('vizality/webpack');
const { AsyncComponent } = require('vizality/components');

const ChannelTextAreaButton = AsyncComponent.from(getModuleByDisplayName('ChannelTextAreaButton', true));

module.exports = class ResetButton extends React.PureComponent {
  constructor () {
    super();

    this.state = {
      buttonClass: ''
    };
  }

  async componentDidMount () {
    const buttonClass = (await getModule([ 'channelTextArea', 'inner' ], true)).button;
    this.setState({ buttonClass });
  }

  render () {
    return (
      <ChannelTextAreaButton
        className={this.state.buttonClass}
        iconName='HappyBubble'
        label='Restore original message'
        onClick={this.props.onClick.bind(this)}
      />
    );
  }
};
