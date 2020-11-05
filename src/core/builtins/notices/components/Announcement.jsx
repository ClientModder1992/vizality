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
      const classes = getModule('noticeBrand');
      classesCache = {
        types: {
          blurple: classes.noticeBrand,
          red: classes.noticeDanger,
          orange: classes.noticeDefault,
          facebook: classes.noticeFacebook,
          blue: classes.noticeInfo,
          dark: classes.noticePremium,
          blurple_gradient: classes.noticePremiumGrandfathered,
          spotify: classes.noticeSpotify,
          purple: classes.noticeStreamerMode,
          green: classes.noticeSuccess,
          survey: classes.noticeSurvey
        },
        button: classes.button,
        dismiss: classes.dismiss
      };

      this.setState(classesCache);
    }
  }

  render () {
    const { types, button, dismiss } = this.state;

    return <div className={`vizality-notice ${(types[this.props.color] || types.blurple)}`} id={this.props.id}>
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
