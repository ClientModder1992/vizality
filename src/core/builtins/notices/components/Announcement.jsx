const { Clickable } = require('@vizality/components');
const { getModule } = require('@vizality/webpack');
const { React } = require('@vizality/react');

let classesCache = null;

module.exports = class Announcement extends React.PureComponent {
  constructor () {
    super();
    this.state = classesCache || {
      types: {},
      button: '',
      dismiss: ''
    };
  }

  async componentDidMount () {
    if (!classesCache) {
      const classes = getModule('notice', 'colorDefault');
      classesCache = {
        types: {
          blurple: classes.colorBrand,
          red: classes.colorDanger,
          orange: classes.colorDefault,
          facebook: classes.colorFacebook,
          blue: classes.colorInfo,
          dark: classes.colorPremium,
          blurple_gradient: classes.colorPremiumGrandfathered,
          spotify: classes.colorSpotify,
          purple: classes.colorStreamerMode,
          green: classes.colorSuccess,
          survey: classes.colorSurvey
        },
        button: classes.button,
        dismiss: classes.closeButton,
        notice: classes.notice
      };

      this.setState(classesCache);
    }
  }

  render () {
    const { types, button, dismiss, notice } = this.state;

    return <div className={`vizality-notice ${(types[this.props.color] || types.blurple)} ${notice}`} id={this.props.id}>
      {this.props.message}
      <Clickable className={dismiss} onClick={() => this.handleClick(this.props.onClose)}/>
      {this.props.button && <button className={button} onClick={() => this.handleClick(this.props.button.onClick)}>
        {this.props.button.text}
      </button>}
    </div>;
  }

  handleClick (func) {
    vizality.api.notices.closeAnnouncement(this.props.id);
    if (func && typeof func === 'function') {
      func();
    }
  }
};
