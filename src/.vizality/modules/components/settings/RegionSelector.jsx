const { React, getModuleByDisplayName } = require('@webpack');

const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const DRegionSelect = AsyncComponent.from(getModuleByDisplayName('RegionSelector', true));

class RegionSelect extends React.PureComponent {

}

module.exports = RegionSelect;
