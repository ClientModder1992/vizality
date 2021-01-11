import React, { PureComponent } from 'react';

import Toast from './Toast';

export default class ToastContainer extends PureComponent {
  constructor (props) {
    super(props);
    this.state = { closing: null };
    this._addedHandler = () => this.forceUpdate();
    this._closingHandler = (id) => {
      this.setState({ closing: id });
      setTimeout(() => this.setState({ closing: null }), 510);
    };
  }

  componentDidMount () {
    vizality.api.notices.on('toastAdded', this._addedHandler);
    vizality.api.notices.on('toastClosing', this._closingHandler);
  }

  componentWillUnmount () {
    vizality.api.notices.off('toastAdded', this._addedHandler);
    vizality.api.notices.off('toastClosing', this._closingHandler);
  }

  render () {
    const toast = Object.keys(vizality.api.notices.toasts).pop();
    return <div className='vz-toast-container'>
      {toast && <Toast
        closing={this.state.closing === toast} id={toast}
        {...vizality.api.notices.toasts[toast]}
      />}
    </div>;
  }
}