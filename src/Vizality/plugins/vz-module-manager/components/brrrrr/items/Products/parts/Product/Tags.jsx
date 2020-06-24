const { React } = require('vizality/webpack');
const { FormTitle } = require('vizality/components');

module.exports = ({ tags }) =>
  <div className='vizality-product-tags'>
    <FormTitle>Tags</FormTitle>
    <div className='items'>
      {tags.map(tag => <div className='tag'>{tag}</div>)}
    </div>
  </div>;
