const webContents = require('electron').remote.getCurrentWebContents();
const { React, getModule } = require('vizality/webpack');
const { Icon} = require('vizality/components');

module.exports = class Titlebar extends React.Component {
  render () {
    const { type, headerText, showExtras } = this.props;
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
              className={`vizality-titlebar__button-container back small ${!webContents.canGoBack() ? 'disabled' : ''}`}
              title='Back'
              onClick={() => {
                getModule('history', false).history.back();
              }}
            >
              <Icon wrapperClassName='vizality-titlebar__icon-wrapper' type='caret-left'></Icon>
            </div>}

            {showExtras && <div
              className={`vizality-titlebar__button-container forward small ${!webContents.canGoForward() ? 'disabled' : ''}`}
              title='Forward'
              onClick={() => {
                getModule('history', false).history.forward();
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
};
