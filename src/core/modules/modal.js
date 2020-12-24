import React from 'react';

import { modal } from '@vizality/webpack';

/**
 * Opens a new modal.
 * @param {React.Component|function(): React.Element} Component Modal component to show
 */
export const open = Component => {
  modal.push(
    class VizalityModal extends React.Component {
      render () {
        return <Component />;
      }
    }
  );
};

/**
 * Closes the currently opened modal
 */
export const close = () => {
  modal.pop();
};

/**
 * Closes all modals
 */
export const closeAll = () => {
  modal.popAll();
};
