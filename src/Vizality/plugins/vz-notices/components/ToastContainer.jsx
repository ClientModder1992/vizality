const { React } = require('vizality/webpack');
const Toast = require('./Toast');

class ToastContainer extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = { leaving: null };
    this._addedHandler = () => this.forceUpdate();
    this._leavingHandler = (id) => {
      this.setState({ leaving: id });
      setTimeout(() => this.setState({ leaving: null }), 510);
    };
  }

  componentDidMount () {
    vizality.api.notices.on('toastAdded', this._addedHandler);
    vizality.api.notices.on('toastLeaving', this._leavingHandler);
  }

  componentWillUnmount () {
    vizality.api.notices.off('toastAdded', this._addedHandler);
    vizality.api.notices.off('toastLeaving', this._leavingHandler);
  }

  render () {
    const toast = Object.keys(vizality.api.notices.toasts).pop();
    return <div className='vizality-toast-container'>
      {toast && <Toast
        leaving={this.state.leaving === toast} id={toast}
        {...vizality.api.notices.toasts[toast]}
      />}
    </div>;
  }
}

module.exports = ToastContainer;
