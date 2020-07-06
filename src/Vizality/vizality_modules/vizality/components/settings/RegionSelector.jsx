const { React, getModuleByDisplayName } = require('vizality/webpack');
const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const DRegionSelector = AsyncComponent.from(getModuleByDisplayName('RegionSelector', true));

module.exports = class RegionSelector extends React.PureComponent {

};
