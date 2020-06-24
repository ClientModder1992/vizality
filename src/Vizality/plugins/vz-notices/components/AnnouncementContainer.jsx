const { React } = require('vizality/webpack');
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
    const aId = Object.keys(vizality.api.notices.announcements).pop();
    return aId
      ? <Announcement id={aId} {...vizality.api.notices.announcements[aId]}/>
      : null;
  }
}

module.exports = AnnouncementContainer;
