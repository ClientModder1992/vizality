const { Card } = require('@components');
const { React } = require('@react');

const BaseProduct = require('./BaseProduct');

module.exports = class InstalledProduct extends BaseProduct {
  render () {
    return (
      <Card className='vizality-entity'>
        {this.renderHeader()}
        {this.renderDetails()}
        {this.renderPermissions()}
        {this.renderFooter()}
      </Card>
    );
  }
};
