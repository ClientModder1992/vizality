const { Flux, getModule, getModuleByDisplayName } = require('@webpack');
const { AsyncComponent, Tooltip, HeaderBar, Clickable, Icon } = require('@components');
const { joinClassNames } = require('@util');
const { Messages } = require('@i18n');
const { React } = require('@react');

const SplashScreen = require('./SplashScreen');
const Settings = require('./Settings');
const TitleBar = require('./TitleBar');
const ForceUI = require('./ForceUI');

const VerticalScroller = AsyncComponent.from(getModuleByDisplayName('VerticalScroller'));

class SdkWindow extends React.PureComponent {
  constructor (props) {
    super(props);
    this.scrollerRef = React.createRef();
  }

  render () {
    const { colorStandard } = getModule('colorStandard');

    return (
      <>
        <TitleBar type='WINDOWS' windowKey={'DISCORD_VIZALITY_SANDBOX'} themeOverride={this.props.theme}/>
        {this.renderHeaderBar()}
        <div className={`vizality-sdk ${colorStandard}`}>
          <VerticalScroller _pass={{ ref: this.scrollerRef }}>
            <div className='vizality-sdk-container'>
              <ForceUI/>
              <SplashScreen/>
              <Settings/>
            </div>
          </VerticalScroller>
        </div>
      </>
    );
  }

  renderHeaderBar () {
    const { title } = getModule('title', 'chatContent');
    return (
      <HeaderBar transparent={false} className={joinClassNames(title, 'vizality-sdk-header')}>
        {this.renderIcon('Force UI', 'Arch', 'force-ui', 'right')}
        {this.renderIcon('Discord Splash Screen', 'Arch', 'splash-screen')}
        {this.renderIcon('SDK Settings', 'Gear', 'sdk-settings')}
        {this.props.windowOnTop
          ? this.renderIcon(Messages.POPOUT_REMOVE_FROM_TOP, 'UnpinLayer', null, 'left')
          : this.renderIcon(Messages.POPOUT_STAY_ON_TOP, 'PinLayer', null, 'left')}
      </HeaderBar>
    );
  }

  renderIcon (tooltip, icon, id, placement = 'bottom') {
    const headerBarClasses = getModule('iconWrapper', 'clickable');
    return (
      <Tooltip text={tooltip} position={placement}>
        <Clickable
          className={joinClassNames(headerBarClasses.iconWrapper, headerBarClasses.clickable)}
          onClick={async () => {
            if (!id) {
              // Consider this is the always on top thing
              const popoutModule = getModule('setAlwaysOnTop', 'open');
              return popoutModule.setAlwaysOnTop('DISCORD_VIZALITY_SANDBOX', !this.props.windowOnTop);
            }
            const el = this.props.guestWindow.document.getElementById(id);
            this.scrollerRef.current.scrollIntoView(el);
          }}
        >
          <Icon name={icon} className={headerBarClasses.icon}/>
        </Clickable>
      </Tooltip>
    );
  }
}

module.exports = Flux.connectStoresAsync(
  [ getModule('theme', 'locale'), getModule('getWindow') ],
  ([ { theme }, windowStore ]) => ({
    guestWindow: windowStore.getWindow('DISCORD_VIZALITY_SANDBOX'),
    windowOnTop: windowStore.getIsAlwaysOnTop('DISCORD_VIZALITY_SANDBOX'),
    theme
  })
)(SdkWindow);
