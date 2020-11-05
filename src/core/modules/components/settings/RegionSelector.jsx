const { getModuleByDisplayName } = require('@vizality/webpack');
const { React } = require('@vizality/react');

const AsyncComponent = require('../AsyncComponent');

const DRegionSelect = AsyncComponent.from(getModuleByDisplayName('RegionSelector', true));

module.exports = class RegionSelect extends React.PureComponent {

};
