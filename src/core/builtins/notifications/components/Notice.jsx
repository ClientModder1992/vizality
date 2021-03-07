/* eslint-disable no-unused-vars */
import { Notice, AsyncComponent } from '@vizality/components';
import Util from '@vizality/util';
import React from 'react';

const NoticeCloseButton = AsyncComponent.fetchFromProps('NoticeCloseButton');
const NoticeButtonAncor = AsyncComponent.fetchFromProps('NoticeButton');
const NoticeButton = AsyncComponent.fetchFromProps('NoticeButton');

/** @private */
const _labels = [ 'Component', 'Notice' ];
const _log = (...message) => Util.logger.log({ labels: _labels, message });
const _warn = (...message) => Util.logger.warn({ labels: _labels, message });
const _error = (...message) => Util.logger.error({ labels: _labels, message });

export default React.memo(props => {
  const handleClick = callback => {
    try {
      vizality.api.notifications.closeNotice(props.id);
      if (callback && typeof callback === 'function') {
        return callback();
      }
    } catch (err) {
      return _error(err);
    }
  };

  return (
    <Notice className={props.className} color={Notice.Colors[props.color?.toUpperCase()] || Notice.Colors.BLURPLE} vz-notice-id={props.id}>
      <NoticeCloseButton onClick={() => handleClick(props.callback)} />
      {props.message}
      {props.buttons?.length && (
        props.buttons.map((button, index) => {
          return index !== props.buttons.length
            ? (
              <NoticeButton onClick={() => handleClick(button.onClick)}>
                {button.text}
              </NoticeButton>
            )
            : (
              <NoticeButtonAncor onClick={() => handleClick(button.onClick)}>
                {button.text}
              </NoticeButtonAncor>
            );
        })
      )}
    </Notice>
  );
});
