const { React } = require('vizality/webpack');
const { Card } = require('vizality/components');

const BaseProduct = require('./BaseProduct');

class InstalledProduct extends BaseProduct {
  render () {
    return (
      <Card className='vizality-product'>
        {this.renderHeader()}
        {this.renderDetails()}
        {this.renderPermissions()}
        {this.renderFooter()}
      </Card>
    );
  }
}

module.exports = InstalledProduct;
