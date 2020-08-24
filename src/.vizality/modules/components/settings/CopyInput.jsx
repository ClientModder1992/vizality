const Webpack = require('@webpack');

const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const Copy = AsyncComponent.from(Webpack.getModuleByDisplayName('CopyInput', true));

module.exports = class CopyInput extends Webpack.React.PureComponent {
  render () {
    const { children: title, note, required } = this.props;
    delete this.props.children;

    return (
      <FormItem title={title} note={note} required={required}>
        <Copy {...this.props}
        />
      </FormItem>
    );
  }
};

/**
 * AVAILABLE PROPS
 *
 * isVertical={ false }
 * value={ 'I like pie' }
 */
