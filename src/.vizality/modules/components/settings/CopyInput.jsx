const { getModuleByDisplayName, React } = require('@webpack');

const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const Copy = AsyncComponent.from(getModuleByDisplayName('CopyInput', true));

class CopyInput extends React.PureComponent {
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
}

module.exports = CopyInput;

/**
 * AVAILABLE PROPS
 *
 * isVertical={ false }
 * value={ 'I like pie' }
 */
