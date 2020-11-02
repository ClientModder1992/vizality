const { getModuleByDisplayName } = require('@webpack');
const { React } = require('@react');

const AsyncComponent = require('../AsyncComponent');

const DRegionSelect = AsyncComponent.from(getModuleByDisplayName('RegionSelector', true));

module.exports = class RegionSelect extends React.PureComponent {

};
