const { React, getModule, getModuleByDisplayName } = require('vizality/webpack');
const { sleep } = require('vizality/util');
const { TextInput, SwitchItem, Category, RadioGroup, SelectInput, CopyInput, TextArea, RegionSelector, SliderInput, PermissionOverrideItem } = require('vizality/components/settings');

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
