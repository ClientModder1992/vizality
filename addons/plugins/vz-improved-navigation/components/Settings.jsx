const { React } = require('@webpack');

class Settings extends React.Component {
  render () {
    const { getSetting, updateSetting, toggleSetting } = this.props;
    return (
      <div className='navigation-everywhere'>

      </div>
    );
  }
}

module.exports = Settings;
