const { React, modal } = require('@webpack');

module.exports = {
  /**
   * Opens a new modal
   * @param {React.Component|function(): React.Element} Component
   */
  open: (Component) => {
    modal.push(class VizalityModal extends React.Component {
      render () {
        return React.createElement(Component);
      }
    });
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