const { React } = require('@webpack');

const Announcement = require('./Announcement');

class AnnouncementContainer extends React.PureComponent {
  constructor (props) {
    super(props);

    this._handler = () => this.forceUpdate();
  }

  componentDidMount () {
    vizality.api.notices.on('announcementAdded', this._handler);
    vizality.api.notices.on('announcementClosed', this._handler);
  }

  componentWillUnmount () {
    vizality.api.notices.off('announcementAdded', this._handler);
    vizality.api.notices.off('announcementClosed', this._handler);
  }

  render () {
    const announcementId = Object.keys(vizality.api.notices.announcements).pop();
    return announcementId
      ? <Announcement id={announcementId} {...vizality.api.notices.announcements[announcementId]}/>
      : null;
  }
}

module.exports = AnnouncementContainer;
