const { React, getModule } = require('@webpack');
const { Icon } = require('@components');

const { remote: { getCurrentWebContents } } = require('electron');

const store = require('../../../api/settingsStore/store');

class Titlebar extends React.PureComponent {
  componentDidMount () {
    this._onSettingsChange = () => this.forceUpdate();
    store.addChangeListener(this._onSettingsChange);
  }

  componentWillMount () {
    store.removeChangeListener(this._onSettingsChange);
  }

  render () {
    const { type, headerText, showExtras } = this.props;
    const { history } = getModule('history');

    return (
      <>
        {type !== 'none' && <titlebar className={`vizality-titlebar ${type}`}>
          <div className='vizality-titlebar__section-left'>

            {headerText && <div className='vizality-titlebar__header'>
              <span className='vizality-titlebar__header-text'>
                {headerText}
              </span>
            </div>}

            {showExtras && <div
              className={`vizality-titlebar__button-container back small ${!getCurrentWebContents().canGoBack() ? 'disabled' : ''}`}
              title='Back'
              onClick={() => {
                history.back();
              }}
            >
              <Icon wrapperClassName='vizality-titlebar__icon-wrapper' type='caret-left'></Icon>
            </div>}

            {showExtras && <div
              className={`vizality-titlebar__button-container forward small ${!getCurrentWebContents().canGoForward() ? 'disabled' : ''}`}
              title='Forward'
              onClick={() => {
                history.forward();
              }}
            >
              <Icon wrapperClassName='vizality-titlebar__icon-wrapper' type='caret-right'></Icon>
            </div>}

            {showExtras && <div
              className='vizality-titlebar__button-container reload small'
              title='Reload'
              onClick={() => {
                window.reloadElectronApp();
              }}
            >
              <Icon wrapperClassName='vizality-titlebar__icon-wrapper' type='reload'></Icon>
            </div>}

          </div>
          <div className='vizality-titlebar__section-middle'></div>
          <div className='vizality-titlebar__section-right'>
            <div
              className='vizality-titlebar__button-container minimize'
              onClick={() => {
                DiscordNative.window.minimize();
              }}
            >
              <Icon wrapperClassName='vizality-titlebar__icon-wrapper' type='minimize'></Icon>
            </div>
            <div
              className='vizality-titlebar__button-container maximize'
              onClick={() => {
                DiscordNative.window.maximize();
              }}
            >
              <Icon wrapperClassName='vizality-titlebar__icon-wrapper' type='maximize'></Icon>
            </div>
            <div
              className='vizality-titlebar__button-container close'
              onClick={() => {
                DiscordNative.window.close();
              }}
            >
              <Icon wrapperClassName='vizality-titlebar__icon-wrapper' type='close'></Icon>
            </div>
          </div>
        </titlebar>}
      </>
    );
  }
}

module.exports = Titlebar;
