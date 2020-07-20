const { Card } = require('@components');
const { React } = require('@webpack');

const BaseProduct = require('./BaseProduct');

class InstalledProduct extends BaseProduct {
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
}

module.exports = InstalledProduct;
