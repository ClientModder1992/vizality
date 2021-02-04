import React, { memo } from 'react';

import { findInReactTree } from '@vizality/util/react';
import { joinClassNames } from '@vizality/util/dom';
import { patch, unpatch } from '@vizality/patcher';
import { toHash } from '@vizality/util/string';
import { getModule } from '@vizality/webpack';

const FakeBotTag = memo(props => {
  const { children, className } = props;
  const { messageDisplayCompact } = getModule('renderEmbeds', 'renderReactions', 'renderSpoilers');
  const { botTagCozy, botTagCompact } = getModule('botTagCozy');
  const { botTagRegular, botText } = getModule('botTagRegular');
  const { rem } = getModule('rem');

  return (
    <span className={joinClassNames(className, { [botTagCozy]: !messageDisplayCompact, [botTagCompact]: messageDisplayCompact }, botTagRegular, rem)}>
      <div className={botText}>
        {children}
      </div>
    </span>
  );
});

export default () => {
  const MessageHeader = getModule('MessageTimestamp');

  patch('vz-enhancements-bot-tags', MessageHeader, 'default', ([ props ], res) => {
    const { message } = props;
    let text;

    if (message?.author?.phone === toHash('PLUGIN')) text = 'PLUGIN';
    if (message?.author?.phone === toHash('VIZALITY')) text = 'VIZALITY';

    if (message?.webhookId && !message?.messageReference && message?.author?.discriminator === '0000') {
      message.author.bot = false;
      text = 'WEBHOOK';
    }

    if (message?.author?.phone === toHash('PLUGIN') ||
        message?.author?.phone === toHash('VIZALITY') ||
       (message?.webhookId && !message?.messageReference && message?.author?.discriminator === '0000')
    ) {
      const header = findInReactTree(res, r => Array.isArray(r.props?.children) && r.props?.children.find(c => c.props?.message));
      header?.props?.children.push(
        <FakeBotTag className={joinClassNames({ 'vz-bot-plugin-tag': text === 'PLUGIN', 'vz-bot-vizality-tag': text === 'VIZALITY' })}>{text}</FakeBotTag>
      );
    }

    return res;
  });

  return () => unpatch('vz-enhancements-bot-tags');
};
