const { AsyncComponent, Clickable, Tooltip, Icons: { ExternalLink, Pin, Unpin, Close } } = require('@components');
const { React, getModule, getModuleByDisplayName, i18n: { Messages } } = require('@webpack');
const { joinClassNames } = require('@util');

module.exports = AsyncComponent.from((async () => {
  const StandardSidebarView = getModuleByDisplayName('StandardSidebarView');
  const SettingsView = getModuleByDisplayName('SettingsView');

  class DocsSidebarView extends StandardSidebarView {
    render () {
      const res = super.render();
      res.props.className = joinClassNames(res.props.className, 'vizality-documentation');
      return res;
    }

    renderTools () {
      if (this.props.popout) {
        return null;
      }
      const res = super.renderTools();
      res.props.children.props.children = [
        res.props.children.props.children,
        <Tooltip text={Messages.POPOUT_PLAYER} position='bottom'>
          <Clickable
            onClick={this.props.onPopout}
            className='vizality-docs-button'
          >
            <ExternalLink/>
          </Clickable>
        </Tooltip>
      ];
      return res;
    }
  }

  class DocsSettingsView extends SettingsView {
    render () {
      const res = super.render();

      if (!res) {
        return null;
      }

      res.props.popout = this.props.popout;
      res.props.onPopout = this.props.onPopout;
      res.type = DocsSidebarView;

      if (this.props.popout) {
        return (
          <>
            <div className='vizality-docs-titlebar'>
              <Tooltip
                text={this.props.windowOnTop ? Messages.POPOUT_REMOVE_FROM_TOP : Messages.POPOUT_STAY_ON_TOP}
                position='left'
              >
                <Clickable
                  onClick={() => getModule('setAlwaysOnTop', 'open')
                    .setAlwaysOnTop('DISCORD_VIZALITY_DOCUMENTATION', !this.props.windowOnTop)}
                  className='button'
                >
                  {this.props.windowOnTop ? <Unpin/> : <Pin/>}
                </Clickable>
              </Tooltip>
              <Tooltip text={Messages.CLOSE_WINDOW} position='left'>
                <Clickable
                  className='button'
                  onClick={() => getModule('setAlwaysOnTop', 'open').close('DISCORD_VIZALITY_DOCUMENTATION')}
                >
                  <Close/>
                </Clickable>
              </Tooltip>
            </div>
            {res}
          </>
        );
      }
      return res;
    }
  }

  return DocsSettingsView;
})());
