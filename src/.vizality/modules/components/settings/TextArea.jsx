const { React, getModuleByDisplayName } = require('@webpack');

const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const Area = AsyncComponent.from(getModuleByDisplayName('TextArea', true));

module.exports = class TextArea extends React.PureComponent {
  render () {
    const { children: title, note, required } = this.props;
    delete this.props.children;

    return (
      <FormItem title={title} note={note} required={required}>
        <Area {...this.props} />
      </FormItem>
    );
  }
};

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
