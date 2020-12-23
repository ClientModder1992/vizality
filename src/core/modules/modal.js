import React from 'react';

import { modal } from '@vizality/webpack';

export default {
  /**
   * Opens a new modal.
   * @param {React.Component|function(): React.Element} Component Modal component to show
   */
  open: Component => {
    modal.push(
      class VizalityModal extends React.Component {
        render () {
          return <Component />;
        }
      }
    );
  },

  /**
   * Closes the currently opened modal
   */
  close: () => {
    modal.pop();
  },

  /**
   * Closes all modals
   */
  closeAll: () => {
    modal.popAll();
  }
};
