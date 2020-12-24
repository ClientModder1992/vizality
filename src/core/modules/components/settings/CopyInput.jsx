import React, { memo, useState } from 'react';
import { clipboard } from 'electron';

import { getModuleByDisplayName } from '@vizality/webpack';
import { Messages } from '@vizality/i18n';
import { sleep } from '@vizality/util';

import AsyncComponent from '../AsyncComponent';
import { FormItem } from '..';

const Copy = AsyncComponent.fromDisplayName('CopyInput');

export default memo(props => {
  const CopyInput = getModuleByDisplayName('CopyInput');

  const [ copyText, setCopyText ] = useState(Messages.COPY);
  const [ mode, setMode ] = useState(CopyInput.Modes.DEFAULT);

  // eslint-disable-next-line no-unused-vars
  const { children: title, note, required, isVertical, value } = props;

  return (
    <FormItem title={title} note={note} required={required}>
      <Copy
        text={copyText}
        mode={mode}
        onCopy={async val => {
          /*
           * For some reason, this selects the text in the input so
           * let's clear the selection
           */
          window.getSelection().removeAllRanges();
          clipboard.writeText(val);
          window.getSelection().removeAllRanges();

          setMode(CopyInput.Modes.SUCCESS);
          setCopyText(Messages.COPIED);

          await sleep(500);

          setMode(CopyInput.Modes.DEFAULT);
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
