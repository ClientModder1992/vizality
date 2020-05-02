const { React, Flux, getModule, getModuleByDisplayName, i18n: { Messages } } = require('powercord/webpack');
const { SwitchItem, SliderInput, Category, SelectInput } = require('powercord/components/settings');
const { AsyncComponent, KeyboardShortcut, PopoutWindow, Clickable, FormTitle, Tooltip, Icons: { Code, Pin, Gear, Close, Keyboard, ExternalLink, Theme, Expand, LayoutTop, LayoutRight, LayoutLeft, LayoutBottom } } = require('powercord/components');
const CodeMirror = require('./CodeMirror');
const { slugify } = require('powercord/util');

const VerticalScroller = AsyncComponent.from(getModuleByDisplayName('VerticalScroller'));

/*
 * @TODO: Bugs to fix:
 * - Unable to attach the editor while popped out
 * - Does not remount into the appropriate area after unattaching
 * - Ceases to work when you navigate away from Themes tab
 * - Remounts in the normal area while attached and you navigate away from the Themes tab and back again
 */

class QuickCSS extends React.PureComponent {
  constructor () {
    super();
    this.state = {
      cmSettings: false,
      poppedOut: false,
      attached: false,
      attachedSide: null,
      cm: null,
      win: null,
      resizer: null
    };

    this.ref = React.createRef();

    this.original_width = 0;
    this.original_height = 0;
    this.original_x = 0;
    this.original_y = 0;
    this.original_mouse_x = 0;
    this.original_mouse_y = 0;

    this._handleCodeMirrorUpdate = global._.debounce(this._handleCodeMirrorUpdate.bind(this), 300);

    this._saveResizeHeight = global._.debounce(this._saveResizeHeight.bind(this), 250);

    this._handleResizeBegin = this._handleResizeBegin.bind(this);
    this._handleResizeEnd = this._handleResizeEnd.bind(this);
    this._handleResizeMove = this._handleResizeMove.bind(this);
  }

  async componentDidMount () {
    this.app = (await getModule([ 'app', 'layers' ])).app;

    if (this.props.guestWindow) {
      if (!this.props.popout) {
        this.setState({ poppedOut: true });
        this.props.guestWindow.addEventListener('beforeunload', () => {
          this.setState({ poppedOut: false });
        });
      } else {
        this.setState({ win: this.props.guestWindow });
        setTimeout(() => this.state.cm.refresh(), 100);

        // Pass CSS to child window
        const style = document.querySelector('#powercord-css-pc-moduleManager').outerHTML;
        this.props.guestWindow.document.head.innerHTML += style;

        const themes = [ ...powercord.styleManager.themes.values() ];
        for (const theme of themes) {
          if (theme.isTheme && theme.applied) {
            const appliedTheme = document.querySelector(`#powercord-css-${theme.entityID}`).outerHTML;
            this.props.guestWindow.document.head.innerHTML += appliedTheme;
          }
        }
      }
    }
  }

  async componentWillUnmount () { // Just to be sure
    window.removeEventListener('mousemove', this._handleResizeMove);
    window.removeEventListener('mouseup', this._handleResizeEnd);

    const { appMount } = await getModule([ 'appMount' ]);

    if (document.querySelector(`.${appMount} > .powercord-quickcss`)) {
      document.querySelector(`.${appMount} > .powercord-quickcss`).remove();
    }

    this._resetMargins();
  }

  render () {
    return (
      <div
        className={[
          'powercord-quickcss',
          this.props.popout && 'popout',
          this.state.attached && 'attached',
          this.state.attachedSide && `attached-${this.state.attachedSide}`,
          this.state.attachedOut && 'oh-god',
          this.state.poppedOut && 'popped-out',
          this.state.cmStyleEditor && 'style-editor-active',
          this.state.cmSettings && 'settings-active',
          this.props.getSetting('quickcss-lineNumbers') !== true && 'no-line-numbers',
          `theme-${slugify(this.props.getSetting('quickcss-theme', 'Panda'))}`
        ].filter(Boolean).join(' ')}
        quickcss-font-family={this.props.getSetting('quickcss-fontFamily', 'Source Code Pro')}
        quickcss-font-size={this.props.getSetting('quickcss-fontSize', 14)}
        quickcss-line-height={this.props.getSetting('quickcss-lineHeight', 22)}
        style={{
          '--quickcss-font-family': `${this.props.getSetting('quickcss-fontFamily', 'Source Code Pro')}`,
          '--quickcss-font-size': `${this.props.getSetting('quickcss-fontSize', 16)}px`,
          '--quickcss-line-height': `${this.props.getSetting('quickcss-lineHeight', 22)}px`,
          height: !this.props.popout ? this.props.getSetting('quickcss-height') : '100%'
        }}
        ref={this.ref}
      >
        {this.state.poppedOut
          ? <div className='powercord-quickcss-popped'>{Messages.POWERCORD_QUICKCSS_POPPED_OUT}</div>
          : <>
            <div className='powercord-quickcss-header'>
              <div className='powercord-quickcss-header-section-left'>
                <Code height={12} className='powercord-pencil-icon' style={{
                  marginRight: 8,
                  opacity: 0.7
                }} />
                <FormTitle tag='h2'>{Messages.POWERCORD_QUICKCSS}</FormTitle>
              </div>
              <div className='powercord-quickcss-header-section-middle'></div>
              <div className='powercord-quickcss-header-section-right'>
                <div className='powercord-quickcss-attach-buttons-container'>
                  <div className='powercord-quickcss-attach-buttons-container-inner'>
                    <Tooltip className={[
                      'unattach-icon-container',
                      this.state.attachedSide && `attached-${this.state.attachedSide}`
                    ].filter(Boolean).join(' ')}
                    text={!this.state.attached ? 'Attach' : 'Unattach'} position='left'>
                      <Clickable
                        onClick={(e) => this.state.attached ? this._unattachQuickCSS() : e.stopPropagation()}
                        className='button'
                      >
                        <Expand/>
                      </Clickable>
                    </Tooltip>
                    <Tooltip className={'attach-icon-container'} text={'Attach Left'} position='left'>
                      <Clickable
                        onClick={() => {
                          this.setState({
                            attached: true,
                            attachedSide: 'left',
                            attachedOut: true
                          });

                          this._attachQuickCSS('left');
                        }}
                        className='button'
                      >
                        <LayoutLeft/>
                      </Clickable>
                    </Tooltip>
                    <Tooltip className={'attach-icon-container'} text={'Attach Top'} position='left'>
                      <Clickable
                        onClick={() => {
                          this.setState({
                            attached: true,
                            attachedSide: 'top',
                            attachedOut: true
                          });

                          this._attachQuickCSS('top');
                        }}
                        className='button'
                      >
                        <LayoutTop/>
                      </Clickable>
                    </Tooltip>
                    <Tooltip className={'attach-icon-container'} text={'Attach Right'} position='left'>
                      <Clickable
                        onClick={() => {
                          this.setState({
                            attached: true,
                            attachedSide: 'right',
                            attachedOut: true
                          });

                          this._attachQuickCSS('right');
                        }}
                        className='button'
                      >
                        <LayoutRight/>
                      </Clickable>
                    </Tooltip>
                    <Tooltip className={'attach-icon-container'} text={'Attach Bottom'} position='left'>
                      <Clickable
                        onClick={() => {
                          this.setState({
                            attached: true,
                            attachedSide: 'bottom',
                            attachedOut: true
                          });

                          this._attachQuickCSS('bottom');
                        }}
                        className='button'
                      >
                        <LayoutBottom/>
                      </Clickable>
                    </Tooltip>
                  </div>
                </div>
                {this.props.popout &&
                  <Tooltip className={this.props.windowOnTop ? 'remove-from-top-icon-container' : 'stay-on-top-icon-container'} text={this.props.windowOnTop ? Messages.POPOUT_REMOVE_FROM_TOP : Messages.POPOUT_STAY_ON_TOP} position='left'>
                    <Clickable
                      onClick={async () => {
                        const popoutModule = await getModule([ 'setAlwaysOnTop', 'open' ]);
                        popoutModule.setAlwaysOnTop('DISCORD_POWERCORD_QUICKCSS', !this.props.windowOnTop);
                      }}
                      className='button'
                    >
                      <Pin/>
                    </Clickable>
                  </Tooltip>}
                <Tooltip className={this.props.popout ? 'popout-icon-container' : 'close-icon-container'} text={this.props.popout ? Messages.CLOSE_WINDOW : Messages.POPOUT_PLAYER} position='left'>
                  <Clickable
                    onClick={() => this.props.popout ? this.state.win.close() : this._openPopout()}
                    className='button'
                  >
                    {this.props.popout ? <Close/> : <ExternalLink/>}
                  </Clickable>
                </Tooltip>
              </div>
            </div>
            <div className='powercord-quickcss-editor'>
              {this.state.cmStyleEditor && this.renderStyleEditor()}
              {this.state.cmSettings && this.renderSettings()}
              <CodeMirror
                popout={this.props.popout}
                onReady={this.setupCodeMirror.bind(this)}
                getSetting={this.props.getSetting}
              />
            </div>
            <div className='powercord-quickcss-footer'>
              <div className='powercord-quickcss-footer-section-left'>
                <Keyboard height={26}/>
                <div className='powercord-quickcss-keyboard-shortcuts-container'>
                  <div className='powercord-quickcss-keyboard-shortcuts-header'>
                    Keyboard Shortcuts
                  </div>
                  <div className='powercord-quickcss-keyboard-shortcut'>
                    <div className='powercord-quickcss-keyboard-shortcuts-text'>
                      Find
                    </div>
                    <div className='powercord-quickcss-keyboard-shortcuts-key'>
                      <KeyboardShortcut shortcut={'ctrl+f'} />
                    </div>
                  </div>
                  <div className='powercord-quickcss-keyboard-shortcut'>
                    <div className='powercord-quickcss-keyboard-shortcuts-text'>
                      Replace
                    </div>
                    <div className='powercord-quickcss-keyboard-shortcuts-key'>
                      <KeyboardShortcut shortcut={'ctrl+h'} />
                    </div>
                  </div>
                  <div className='powercord-quickcss-keyboard-shortcut'>
                    <div className='powercord-quickcss-keyboard-shortcuts-text'>
                      Autocomplete
                    </div>
                    <div className='powercord-quickcss-keyboard-shortcuts-key'>
                      <KeyboardShortcut shortcut={'ctrl+space'} />
                    </div>
                  </div>
                  <div className='powercord-quickcss-keyboard-shortcut'>
                    <div className='powercord-quickcss-keyboard-shortcuts-text'>
                      Fold All
                    </div>
                    <div className='powercord-quickcss-keyboard-shortcuts-key'>
                      <KeyboardShortcut shortcut={'ctrl+shift+-'} />
                    </div>
                  </div>
                  <div className='powercord-quickcss-keyboard-shortcut'>
                    <div className='powercord-quickcss-keyboard-shortcuts-text'>
                      Unfold All
                    </div>
                    <div className='powercord-quickcss-keyboard-shortcuts-key'>
                      <KeyboardShortcut shortcut={'ctrl+shift+='} />
                    </div>
                  </div>
                </div>
              </div>
              <div className='powercord-quickcss-footer-section-right'>
                <Tooltip className={[
                  'settings-icon-container',
                  this.state.cmSettings && 'active'
                ].filter(Boolean).join(' ')}
                text={Messages.SETTINGS} position='left'>
                  <Clickable onClick={() => this.setState({ cmSettings: true,
                    cmStyleEditor: false })} className='button'>
                    <Gear/>
                  </Clickable>
                </Tooltip>
                <Tooltip className={[
                  'theme-icon-container',
                  this.state.cmStyleEditor && 'active'
                ].filter(Boolean).join(' ')}
                text={Messages.POWERCORD_QUICKCSS_STYLE_EDITOR} position='left'>
                  <Clickable onClick={() => this.setState({ cmStyleEditor: true,
                    cmSettings: false })} className='button'>
                    <Theme/>
                  </Clickable>
                </Tooltip>
              </div>
            </div>
            {!this.props.popout && <div
              className='powercord-quickcss-resizer'
              onMouseDown={(e) => this._handleResizeBegin(e) }
            />}
          </>}
      </div>
    );
  }

  renderStyleEditor () {
    const { getSetting, updateSetting, toggleSetting } = this.props;

    return (
      <VerticalScroller outerClassName='powercord-quickcss-style-editor' className='powercord-quickcss-style-editor-scroller' theme='themeGhostHairline-DBD-2d' fade>
        <div className='powercord-quickcss-section-header-container'>
          <FormTitle tag='h2' className='powercord-quickcss-section-header'>{Messages.POWERCORD_QUICKCSS_STYLE_EDITOR}</FormTitle>
          <div className='close-wrapper'>
            <Tooltip text={Messages.CLOSE} position='left'>
              <Clickable onClick={() => this.setState({ cmStyleEditor: false })} className='close'>
                <Close/>
              </Clickable>
            </Tooltip>
          </div>
        </div>
        <div className='powercord-quickcss-style-editor-preview'>
          <FormTitle tag='h2'>{Messages.POWERCORD_QUICKCSS_STYLE_EDITOR_PREVIEW}</FormTitle>
          <div className='CodeMirror box'>
            <div className='CodeMirror-code'>
              <div>
                <pre>
                  <span>
                    <span className='cm-tag'>html</span>, <span className='cm-tag'>body</span> {'{'}
                  </span>
                </pre>
              </div>
              <div>
                <pre>
                  <span>
                    <span className='indentation'>  </span>
                    <span className='cm-property'>height</span>: <span className='cm-number'>100%</span>;
                  </span>
                </pre>
              </div>
              <div>
                <pre>
                  <span>
                    <span className='indentation'>  </span>
                    <span className='cm-comment'>/* Full Screen */</span>
                  </span>
                </pre>
              </div>
              <div>
                <pre>
                  <span>{'}'}</span>
                </pre>
              </div>
              <div>
                <pre>
                  <span>
                    <span className='cm-tag'>body</span>:<span className='cm-variable-3'>after</span> {'{'}
                  </span>
                </pre>
              </div>
              <div>
                <pre>
                  <span>
                    <span className='indentation'>  </span><span className='cm-property'>content</span>: <span className='cm-string'>'foo !== bar'</span>
                  </span>
                </pre>
              </div>
              <div>
                <pre>
                  <span>{'}'}</span>
                </pre>
              </div>
              <div>
                <pre>
                  <span>
                    <span className='cm-def'>@media</span> (<span className='cm-property'>min-width</span>: <span className='cm-number'>300px</span>) {'{'}
                  </span>
                </pre>
              </div>
              <div>
                <pre>
                  <span>
                    <span className='indentation'><span className='indentation'>  </span></span><span className='cm-qualifier'>.cool</span> {'{'}
                  </span>
                </pre>
              </div>
              <div>
                <pre>
                  <span>
                    <span className='indendation-2'> &nbsp;  </span><span className='cm-property'>padding</span>: <span className='cm-number'>5%</span>;
                  </span>
                </pre>
              </div>
              <div>
                <pre>
                  <span>
                    <span className='indentation'>  </span>{'}'}
                  </span>
                </pre>
              </div>
              <div>
                <pre>
                  <span>{'}'}</span>
                </pre>
              </div>
            </div>
          </div>
        </div>
        <div className='powercord-quickcss-style-editor-body'>
          <FormTitle tag='h2'>Style Options</FormTitle>
          <Category
            name={'Syntax Highlighting'}
            opened={getSetting('quickcss-syntaxHighlighting', false)}
            onChange={() => toggleSetting('quickcss-syntaxHighlighting')}
          >
            <FormTitle tag='h5'>Syntax Themes</FormTitle>
            <div className='powercord-quickcss-theme-items'>
              <Tooltip
                text={'Twilight'}
                position='top'
                className={[
                  'powercord-quickcss-theme-item-container',
                  getSetting('quickcss-theme') === 'Twilight' && 'active'
                ].filter(Boolean).join(' ')}
              >
                <Clickable onClick={() => updateSetting('quickcss-theme', 'Twilight')} className='powercord-quickcss-theme-item'>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#a7925a' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#717790' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#9a8297' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#96b38a' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#ddca7e' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#5a5f73' }}></div>
                </Clickable>
              </Tooltip>
              <Tooltip
                text={'Tomorrow Night'}
                position='top'
                className={[
                  'powercord-quickcss-theme-item-container',
                  getSetting('quickcss-theme') === 'Tomorrow Night' && 'active'
                ].filter(Boolean).join(' ')}
              >
                <Clickable onClick={() => updateSetting('quickcss-theme', 'Tomorrow Night')} className='powercord-quickcss-theme-item'>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#efc371' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#b5bc67' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#dd925f' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#ae94c0' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#c3c6c4' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#717790' }}></div>
                </Clickable>
              </Tooltip>
              <Tooltip
                text={'Oceanic Dark'}
                position='top'
                className={[
                  'powercord-quickcss-theme-item-container',
                  getSetting('quickcss-theme') === 'Oceanic Dark' && 'active'
                ].filter(Boolean).join(' ')}
              >
                <Clickable onClick={() => updateSetting('quickcss-theme', 'Oceanic Dark')} className='powercord-quickcss-theme-item'>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#65737e' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#c594c5' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#99c794' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#ec5f67' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#fac863' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#f99157' }}></div>
                </Clickable>
              </Tooltip>
              <Tooltip
                text={'Dracula'}
                position='top'
                className={[
                  'powercord-quickcss-theme-item-container',
                  getSetting('quickcss-theme') === 'Dracula' && 'active'
                ].filter(Boolean).join(' ')}
              >
                <Clickable onClick={() => updateSetting('quickcss-theme', 'Dracula')} className='powercord-quickcss-theme-item'>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#f1fa8c' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#bd93f9' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#50fa7b' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#ff79c6' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#66d9ef' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#ffb86c' }}></div>
                </Clickable>
              </Tooltip>
              <Tooltip
                text={'DuoTone Dark'}
                position='top'
                className={[
                  'powercord-quickcss-theme-item-container',
                  getSetting('quickcss-theme') === 'DuoTone Dark' && 'active'
                ].filter(Boolean).join(' ')}
              >
                <Clickable onClick={() => updateSetting('quickcss-theme', 'DuoTone Dark')} className='powercord-quickcss-theme-item'>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#9b87fd' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#e09142' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#ffba76' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#ffa852' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#6a51e6' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#eeebff' }}></div>
                </Clickable>
              </Tooltip>
              <Tooltip
                text={'Material Ocean'}
                position='top'
                className={[
                  'powercord-quickcss-theme-item-container',
                  getSetting('quickcss-theme') === 'Material Ocean' && 'active'
                ].filter(Boolean).join(' ')}
              >
                <Clickable onClick={() => updateSetting('quickcss-theme', 'Material Ocean')} className='powercord-quickcss-theme-item'>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#C792EA' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#89DDFF' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#f07178' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#FF5370' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#C3E88D' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#DECB6B' }}></div>
                </Clickable>
              </Tooltip>
              <Tooltip
                text={'Monokai'}
                position='top'
                className={[
                  'powercord-quickcss-theme-item-container',
                  getSetting('quickcss-theme') === 'Monokai' && 'active'
                ].filter(Boolean).join(' ')}
              >
                <Clickable onClick={() => updateSetting('quickcss-theme', 'Monokai')} className='powercord-quickcss-theme-item'>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#f92672' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#a6e22e' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#ae81ff' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#9effff' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#fd971f' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#e6db74' }}></div>
                </Clickable>
              </Tooltip>
              <Tooltip
                text={'Moxer'}
                position='top'
                className={[
                  'powercord-quickcss-theme-item-container',
                  getSetting('quickcss-theme') === 'Moxer' && 'active'
                ].filter(Boolean).join(' ')}
              >
                <Clickable onClick={() => updateSetting('quickcss-theme', 'Moxer')} className='powercord-quickcss-theme-item'>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#ff5370' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#81c5da' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#7ca4c0' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#b2e4ae' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#ffcb6b' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#f5dfa5' }}></div>
                </Clickable>
              </Tooltip>
              <Tooltip
                text={'Nord'}
                position='top'
                className={[
                  'powercord-quickcss-theme-item-container',
                  getSetting('quickcss-theme') === 'Nord' && 'active'
                ].filter(Boolean).join(' ')}
              >
                <Clickable onClick={() => updateSetting('quickcss-theme', 'Nord')} className='powercord-quickcss-theme-item'>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#bf616a' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#81a1c1' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#b48ead' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#a3be8c' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#8fbcbb' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#bc6283' }}></div>
                </Clickable>
              </Tooltip>
              <Tooltip
                text={'Panda'}
                position='top'
                className={[
                  'powercord-quickcss-theme-item-container',
                  getSetting('quickcss-theme') === 'Panda' && 'active'
                ].filter(Boolean).join(' ')}
              >
                <Clickable onClick={() => updateSetting('quickcss-theme', 'Panda')} className='powercord-quickcss-theme-item'>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#19f9d8' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#ff2c6d' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#ffb86c' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#ff9ac1' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#b084eb' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#676b79' }}></div>
                </Clickable>
              </Tooltip>
              <Tooltip
                text={'Seti'}
                position='top'
                className={[
                  'powercord-quickcss-theme-item-container',
                  getSetting('quickcss-theme') === 'Seti' && 'active'
                ].filter(Boolean).join(' ')}
              >
                <Clickable onClick={() => updateSetting('quickcss-theme', 'Seti')} className='powercord-quickcss-theme-item'>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#55b5db' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#a074c4' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#cd3f45' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#ff79c6' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#9fca56' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#e6cd69' }}></div>
                </Clickable>
              </Tooltip>
              <Tooltip
                text={'Yonce'}
                position='top'
                className={[
                  'powercord-quickcss-theme-item-container',
                  getSetting('quickcss-theme') === 'Yonce' && 'active'
                ].filter(Boolean).join(' ')}
              >
                <Clickable onClick={() => updateSetting('quickcss-theme', 'Yonce')} className='powercord-quickcss-theme-item'>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#a06fca' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#e6db74' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#98e342' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#da7dae' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#fc4384' }}></div>
                  <div className='powercord-quickcss-theme-item-color' style={{ background: '#00a7aa' }}></div>
                </Clickable>
              </Tooltip>
            </div>
          </Category>
          <Category
            name={'Fonts'}
            opened={getSetting('quickcss-fonts', false)}
            onChange={() => toggleSetting('quickcss-fonts')}
          >
            <SelectInput
              className={'powercord-quickcss-select-font'}
              searchable={false}
              value={getSetting('quickcss-fontFamily', 'Source Code Pro')}
              options={[
                {
                  value: 'Monospace',
                  label: 'Monospace'
                },
                {
                  value: 'Hack',
                  label: 'Hack'
                },
                {
                  value: 'Inconsolata',
                  label: 'Inconsolata'
                },
                {
                  value: '"Source Code Pro"',
                  label: 'Source Code Pro'
                },
                {
                  value: 'Monoid',
                  label: 'Monoid'
                },
                {
                  value: '"Input Mono"',
                  label: 'Input Mono'
                },
                {
                  value: '"DejaVu Sans Mono"',
                  label: 'DejaVu Sans Mono'
                },
                {
                  value: '"FiraCode Medium"',
                  label: 'FiraCode Medium'
                },
                {
                  value: '"Operator Mono"',
                  label: 'Operator Mono'
                },
                {
                  value: '"Dank Mono"',
                  label: 'Dank Mono'
                },
                {
                  value: 'Gintronic',
                  label: 'Gintronic'
                },
                {
                  value: '"JetBrains Mono"',
                  label: 'JetBrains Mono'
                },
                {
                  value: 'Recursive',
                  label: 'Recursive'
                }
              ]}
              onChange={v => {
                updateSetting('quickcss-fontFamily', v.value);
              }}
            >
              {Messages.CSS_PROPERTY_FONT_FAMILY}
            </SelectInput>

            <SliderInput
              disabled={this.props.popout}
              note={this.props.popout && Messages.POWERCORD_QUICKCSS_SETTINGS_FONT_SIZE_WARNING}
              stickToMarkers
              initialValue={getSetting('quickcss-fontSize', 16)}
              markers={[ 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26 ]}
              onMarkerRender={s => `${s}px`}
              defaultValue={16}
              onValueChange={v => {
                updateSetting('quickcss-fontSize', v);
              }}
            >
              {Messages.CSS_PROPERTY_FONT_SIZE}
            </SliderInput>

            <SliderInput
              disabled={this.props.popout}
              note={this.props.popout && Messages.POWERCORD_QUICKCSS_SETTINGS_LINE_HEIGHT_WARNING}
              stickToMarkers
              initialValue={getSetting('quickcss-lineHeight', 22)}
              markers={[ 12, 14, 16, 18, 20, 22, 24,
                26, 28, 30, 32, 34, 36, 38, 40 ]}
              onMarkerRender={s => `${s}px`}
              defaultValue={22}
              onValueChange={v => {
                updateSetting('quickcss-lineHeight', v);
              }}
            >
              {Messages.CSS_PROPERTY_LINE_HEIGHT}
            </SliderInput>
          </Category>
        </div>
      </VerticalScroller>
    );
  }

  renderSettings () {
    const { getSetting, updateSetting, toggleSetting } = this.props;

    return (
      <VerticalScroller outerClassName='powercord-quickcss-settings' theme='themeGhostHairline-DBD-2d' fade>
        <div className='powercord-quickcss-section-header-container'>
          <FormTitle tag='h2' className='powercord-quickcss-section-header'>{Messages.POWERCORD_QUICKCSS_SETTINGS}</FormTitle>
          <div className='close-wrapper'>
            <Tooltip text={Messages.CLOSE} position='left'>
              <Clickable onClick={() => this.setState({ cmSettings: false })} className='close'>
                <Close/>
              </Clickable>
            </Tooltip>
          </div>
        </div>
        <div className='powercord-quickcss-settings-body'>
          <SwitchItem
            value={getSetting('quickcss-lineNumbers', true)}
            onChange={v => {
              toggleSetting('quickcss-lineNumbers', true);
              this.state.cm.setOption('lineNumbers', v.target.checked);
            }}
          >
            {Messages.POWERCORD_QUICKCSS_SETTINGS_LINES}
          </SwitchItem>
          <SwitchItem
            value={getSetting('quickcss-codeFolding', true)}
            onChange={v => {
              toggleSetting('quickcss-codeFolding', true);
              if (!v.target.checked) {
                this.state.cm.execCommand('unfoldAll');
              }
              this.state.cm.setOption('foldGutter', v.target.checked);
            }}
          >
            {Messages.POWERCORD_QUICKCSS_SETTINGS_FOLDING}
          </SwitchItem>
          <SwitchItem
            value={getSetting('quickcss-matchBrackets', true)}
            note={Messages.POWERCORD_QUICKCSS_SETTINGS_MATCH_BRACKETS_DESC}
            onChange={v => {
              toggleSetting('quickcss-matchBrackets', true);
              this.state.cm.setOption('matchBrackets', v.target.checked);
            }}
          >
            {Messages.POWERCORD_QUICKCSS_SETTINGS_MATCH_BRACKETS}
          </SwitchItem>
          <SwitchItem
            value={getSetting('quickcss-closeBrackets', true)}
            note={Messages.POWERCORD_QUICKCSS_SETTINGS_CLOSE_BRACKETS_DESC}
            onChange={v => {
              toggleSetting('quickcss-closeBrackets', true);
              this.state.cm.setOption('autoCloseBrackets', v.target.checked);
            }}
          >
            {Messages.POWERCORD_QUICKCSS_SETTINGS_CLOSE_BRACKETS}
          </SwitchItem>
          <SwitchItem
            value={getSetting('quickcss-wrap', false)}
            onChange={v => {
              toggleSetting('quickcss-wrap', false);
              this.state.cm.setOption('lineWrapping', v.target.checked);
            }}
          >
            {Messages.POWERCORD_QUICKCSS_SETTINGS_WRAP}
          </SwitchItem>
          <SwitchItem
            value={getSetting('quickcss-tabs', false)}
            onChange={v => {
              toggleSetting('quickcss-tabs', false);
              this.state.cm.setOption('indentWithTabs', v.target.checked);
            }}
          >
            {Messages.POWERCORD_QUICKCSS_SETTINGS_TABS}
          </SwitchItem>
          <SliderInput
            disabled={this.props.popout}
            note={this.props.popout && Messages.POWERCORD_QUICKCSS_SETTINGS_INDENT_WARNING}
            stickToMarkers
            initialValue={getSetting('quickcss-indentSize', 2)}
            markers={[ 2, 4, 8 ]}
            onMarkerRender={s => `${s} spaces`}
            defaultValue={2}
            onValueChange={v => {
              updateSetting('quickcss-indentSize', v);
              this.state.cm.setOption('tabSize', v);
              this.state.cm.setOption('indentUnit', v);
            }}
          >
            {Messages.POWERCORD_QUICKCSS_SETTINGS_INDENT}
          </SliderInput>
        </div>
      </VerticalScroller>
    );
  }

  setupCodeMirror (cm) {
    cm.on('change', this._handleCodeMirrorUpdate);
    cm.setValue(powercord.pluginManager.get('pc-moduleManager')._quickCSS);
    this.setState({ cm });
  }

  async _openPopout () {
    this._unattachQuickCSS();
    const popoutModule = await getModule([ 'setAlwaysOnTop', 'open' ]);
    popoutModule.open('DISCORD_POWERCORD_QUICKCSS', () =>
      React.createElement(PopoutWindow, { windowId: 'DISCORD_POWERCORD_QUICKCSS' },
        React.createElement(this.props.popoutComponent, { popout: true })
      )
    );
    setImmediate(async () => {
      const windowManager = await getModule([ 'getWindow' ]);
      const guestWindow = windowManager.getWindow('DISCORD_POWERCORD_QUICKCSS');
      this.setState({ poppedOut: true });
      guestWindow.addEventListener('beforeunload', () => {
        this.setState({ poppedOut: false });
      });
    });

    if (this.ref.current) {
      this.ref.current.style.removeProperty('width');
      this.ref.current.style.removeProperty('height');
    }
  }

  _resetMargins () {
    if (this.ref.current) {
    // clear margins
      document.querySelector(`.${this.app}`).style.removeProperty('margin-top');
      document.querySelector(`.${this.app}`).style.removeProperty('margin-right');
      document.querySelector(`.${this.app}`).style.removeProperty('margin-bottom');
      document.querySelector(`.${this.app}`).style.removeProperty('margin-left');

      this.ref.current.style.removeProperty('margin-top');
      this.ref.current.style.removeProperty('margin-right');
      this.ref.current.style.removeProperty('margin-bottom');
      this.ref.current.style.removeProperty('margin-left');
    }
  }

  async _attachQuickCSS (side) {
    if (this.props.popout) {
      this.state.win.close();
    }

    this._resetMargins();

    let value;

    const { appMount } = await getModule([ 'appMount' ]);
    if (document.querySelector(`.${appMount}`)) {
      document.querySelector(`.${appMount}`).insertAdjacentElement('afterbegin', document.querySelector('.powercord-quickcss'));

      if (side === 'top' || side === 'bottom') {
        value = parseFloat(getComputedStyle(this.ref.current, null).getPropertyValue('height'));
        this.ref.current.style.removeProperty('width');
      }

      if (side === 'right' || side === 'left') {
        value = parseFloat(getComputedStyle(this.ref.current, null).getPropertyValue('width'));
        this.ref.current.style.removeProperty('height');
      }

      document.querySelector(`.${this.app}`).style.setProperty(`margin-${side}`, `${value}px`);
    } else {
      // @TODO: Fix this to be a toast or alert modal or something
      alert('there was an issue');
    }
  }

  async _unattachQuickCSS () {
    this.setState({
      attached: false,
      attachedSide: null
    });

    this._resetMargins();

    const { appMount } = await getModule([ 'appMount' ]);

    if (document.querySelector(`.${appMount} > .powercord-quickcss`)) {
      document.querySelector(`.${appMount} > .powercord-quickcss`).remove();
    }
  }

  _handleCodeMirrorUpdate (cm) {
    // noinspection JSIgnoredPromiseFromCall
    powercord.pluginManager.get('pc-moduleManager')._saveQuickCSS(cm.getValue());
  }

  _handleResizeBegin (e) {
    this.original_width = parseFloat(getComputedStyle(this.ref.current, null).getPropertyValue('width').replace('px', ''));
    this.original_height = parseFloat(getComputedStyle(this.ref.current, null).getPropertyValue('height').replace('px', ''));
    this.original_x = this.ref.current.getBoundingClientRect().x;
    this.original_y = this.ref.current.getBoundingClientRect().y;
    this.original_mouse_x = e.clientX;
    this.original_mouse_y = e.clientY;

    window.addEventListener('mousemove', this._handleResizeMove);
    window.addEventListener('mouseup', this._handleResizeEnd);
  }

  _handleResizeEnd () {
    window.removeEventListener('mousemove', this._handleResizeMove);
    window.removeEventListener('mouseup', this._handleResizeEnd);
  }

  _handleResizeMove (e) {
    if (this.state.attached && this.state.attachedSide === 'bottom') {
      const height = `${this.original_height - (e.pageY - this.original_mouse_y)}px`;

      document.querySelector(`.${this.app}`).style.setProperty('margin-bottom', height);
      this._saveResizeHeight(height);
    }

    if (this.state.attached && this.state.attachedSide === 'left') {
      const width = `${e.clientX - this.ref.current.getBoundingClientRect().x}px`;

      this.ref.current.style.setProperty('width', width);
      document.querySelector(`.${this.app}`).style.setProperty('margin-left', width);
    }

    if (this.state.attached && this.state.attachedSide === 'top') {
      const height = `${e.clientY - this.ref.current.getBoundingClientRect().y}px`;

      document.querySelector(`.${this.app}`).style.setProperty('margin-top', height);
      this._saveResizeHeight(height);
    }

    if (this.state.attached && this.state.attachedSide === 'right') {
      const width = `${this.original_width - (e.pageX - this.original_mouse_x)}px`;

      this.ref.current.style.setProperty('width', width);
      document.querySelector(`.${this.app}`).style.setProperty('margin-right', width);
    }

    if (!this.state.attached) {
      const height = `${e.clientY - this.ref.current.getBoundingClientRect().y}px`;

      document.querySelector(`.${this.app}`).style.setProperty('margin-bottom', `${height}px`);
      this._saveResizeHeight(height);
    }
  }

  _saveResizeHeight (height) {
    this.props.updateSetting('quickcss-height', height);
  }
}

module.exports = Flux.connectStoresAsync(
  [ getModule([ 'getWindow' ]) ],
  ([ windowManager ]) => ({
    guestWindow: windowManager.getWindow('DISCORD_POWERCORD_QUICKCSS'),
    windowOnTop: windowManager.getIsAlwaysOnTop('DISCORD_POWERCORD_QUICKCSS')
  })
)(QuickCSS);
