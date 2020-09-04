const { getModuleByDisplayName } = require('@webpack');
const { React } = require('@react');

const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const TextArea = AsyncComponent.from(getModuleByDisplayName('TextArea', true));

module.exports = React.memo(props => {
  const { children: title, note, required } = props;
  delete this.props.children;

  return (
    <FormItem title={title} note={note} required={required} noteHasMargin>
      <TextArea {...props}/>
    </FormItem>
  );
});

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
