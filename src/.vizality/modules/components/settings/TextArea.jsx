const { getModuleByDisplayName, React } = require('@webpack');

const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const Area = AsyncComponent.from(getModuleByDisplayName('TextArea', true));

class TextArea extends React.PureComponent {
  render () {
    const { children: title, note, required } = this.props;
    delete this.props.children;

    return (
      <FormItem title={title} note={note} required={required}>
        <Area {...this.props} />
      </FormItem>
    );
  }
}

module.exports = TextArea;

/**
 * AVAILABLE PROPS
 *
 * autoFocus={ false }
 * autosize={ false }
 * disabled={ false }
 * flex={ false }
 * maxLength={ 120 }
 * name={ '' }
 * onChange={ '' }
 * placeholder={ 'What can people do in this server?' }
 * resizeable={ false }
 * rows={ 3 }
 * value={ '' }
 */
