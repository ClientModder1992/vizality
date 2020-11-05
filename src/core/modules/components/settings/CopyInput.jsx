const { clipboard } = require('electron');

const { React, React: { useState } } = require('@vizality/react');
const { getModuleByDisplayName } = require('@vizality/webpack');
const { Messages } = require('@vizality/i18n');
const { sleep } = require('@vizality/util');

const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const Copy = AsyncComponent.from(getModuleByDisplayName('CopyInput', true));

module.exports = React.memo(props => {
  const copyInput = getModuleByDisplayName('CopyInput');

  const [ copyText, setCopyText ] = useState(Messages.COPY);
  const [ mode, setMode ] = useState(copyInput.Modes.DEFAULT);

  const { children: title, note, required } = props;

  return (
    <FormItem title={title} note={note} required={required}>
      <Copy
        text={copyText}
        mode={mode}
        onCopy={async val => {
          // For some reason, this selects the text in the input so let's clear the selection
          window.getSelection().removeAllRanges();
          clipboard.writeText(val);
          window.getSelection().removeAllRanges();

          setMode(copyInput.Modes.SUCCESS);
          setCopyText(Messages.COPIED);
          await sleep(500);
          setMode(copyInput.Modes.DEFAULT);
          setCopyText(Messages.COPY);
        }}
        value={props.value}
      />
    </FormItem>
  );
});

/**
 * AVAILABLE PROPS
 *
 * isVertical={ false }
 * value={ 'I like pie' }
 */
