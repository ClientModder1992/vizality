const { AdvancedScrollerThin, Clickable, FormTitle, Tooltip, Icon, settings: { SwitchItem, SliderInput } } = require('@components');
const { React, React: { useState } } = require('@react');
const { getModule } = require('@webpack');
const { Messages } = require('@i18n');

const CodeMirror = require('./CodeMirror');

module.exports = React.memo(({ getSetting, toggleSetting, updateSetting }) => {
  const [ cm, setCM ] = useState(null);
  const [ cmSettings, setCMSettings ] = useState(false);
  const [ popout, setPopout ] = useState(false);
  const [ guestWindow, getGuestWindow ] = useState(Boolean(getModule('getWindow').getWindow('DISCORD_VIZALITY_QUICKCSS')));
  const [ windowOnTop, getWindowOnTop ] = useState(Boolean(getModule('getWindow').getIsAlwaysOnTop('DISCORD_VIZALITY_QUICKCSS')));

  const _handleCodeMirrorUpdate = (cm) => {
    // noinspection JSIgnoredPromiseFromCall
    vizality.manager.builtins.get('snippet-manager')._saveCustomCSS(cm.getValue());
  };

  const setupCodeMirror = (cm) => {
    cm.on('change', _handleCodeMirrorUpdate);
    cm.setValue(vizality.manager.builtins.get('snippet-manager')._customCSS);
    setTimeout(() => cm.refresh(), 100);
    setCM(cm);
  };

  const renderSettings = () => {
    return (
      <AdvancedScrollerThin className='vizality-quickcss-editor-settings' theme='themeGhostHairline-DBD-2d' fade>
        <FormTitle tag='h2'>{Messages.VIZALITY_QUICKCSS_SETTINGS}</FormTitle>
        <div className='close-wrapper'>
          <Tooltip text={Messages.CLOSE} position='left'>
            <Clickable onClick={() => setCMSettings(false)} className='close'>
              <Icon name='Close' />
            </Clickable>
          </Tooltip>
        </div>
        <div className='settings'>
          <SwitchItem
            value={getSetting('cm-lineNumbers', true)}
            onChange={v => {
              toggleSetting('cm-lineNumbers', true);
              cm.setOption('lineNumbers', v.target.checked);
            }}
          >
            {Messages.VIZALITY_QUICKCSS_SETTINGS_LINES}
          </SwitchItem>
          <SwitchItem
            value={getSetting('cm-codeFolding', true)}
            onChange={v => {
              toggleSetting('cm-codeFolding', true);
              if (!v.target.checked) {
                cm.execCommand('unfoldAll');
              }
              cm.setOption('foldGutter', v.target.checked);
            }}
          >
            {Messages.VIZALITY_QUICKCSS_SETTINGS_FOLDING}
          </SwitchItem>
          <SwitchItem
            value={getSetting('cm-matchBrackets', true)}
            note={Messages.VIZALITY_QUICKCSS_SETTINGS_MATCH_BRACKETS_DESC}
            onChange={v => {
              toggleSetting('cm-matchBrackets', true);
              cm.setOption('matchBrackets', v.target.checked);
            }}
          >
            {Messages.VIZALITY_QUICKCSS_SETTINGS_MATCH_BRACKETS}
          </SwitchItem>
          <SwitchItem
            value={getSetting('cm-closeBrackets', true)}
            note={Messages.VIZALITY_QUICKCSS_SETTINGS_CLOSE_BRACKETS_DESC}
            onChange={v => {
              toggleSetting('cm-closeBrackets', true);
              cm.setOption('autoCloseBrackets', v.target.checked);
            }}
          >
            {Messages.VIZALITY_QUICKCSS_SETTINGS_CLOSE_BRACKETS}
          </SwitchItem>
          <SwitchItem
            value={getSetting('cm-wrap', false)}
            onChange={v => {
              toggleSetting('cm-wrap', false);
              cm.setOption('lineWrapping', v.target.checked);
            }}
          >
            {Messages.VIZALITY_QUICKCSS_SETTINGS_WRAP}
          </SwitchItem>
          <SwitchItem
            value={getSetting('cm-tabs', false)}
            onChange={v => {
              toggleSetting('cm-tabs', false);
              cm.setOption('indentWithTabs', v.target.checked);
            }}
          >
            {Messages.VIZALITY_QUICKCSS_SETTINGS_TABS}
          </SwitchItem>
          <SliderInput
            disabled={popout}
            note={popout && Messages.VIZALITY_QUICKCSS_SETTINGS_INDENT_WARNING}
            stickToMarkers
            initialValue={4}
            markers={[ 2, 4, 8 ]}
            onMarkerRender={s => `${s} spaces`}
            defaultValue={getSetting('cm-indentSize', 2)}
            onValueChange={v => {
              updateSetting('cm-indentSize', v);
              cm.setOption('tabSize', v);
              cm.setOption('indentUnit', v);
            }}
          >
            {Messages.VIZALITY_QUICKCSS_SETTINGS_INDENT}
          </SliderInput>
        </div>
      </AdvancedScrollerThin>
    );
  };

  return (
    <div
      className={[ 'vizality-quickcss', popout && 'popout', !popout && guestWindow && 'popped-out' ].filter(Boolean).join(' ')}
      style={{ '--editor-height': `${getSetting('cm-height', 350)}px` }}
    >
      {!popout && guestWindow
        ? <div className='vizality-quickcss-popped'>{Messages.VIZALITY_QUICKCSS_POPPED_OUT}</div>
        : <>
          <div className='vizality-quickcss-header'>
            <Tooltip text={Messages.SETTINGS} position='right'>
              <Clickable onClick={() => setCMSettings(true)} className='button'>
                <Icon name='Gear' />
              </Clickable>
            </Tooltip>
            <div>
              {popout &&
              <Tooltip
                text={windowOnTop ? Messages.POPOUT_REMOVE_FROM_TOP : Messages.POPOUT_STAY_ON_TOP}
                position='left'
              >
                <Clickable
                  onClick={() => {
                    const popoutModule = getModule('setAlwaysOnTop', 'open');
                    popoutModule.setAlwaysOnTop('DISCORD_VIZALITY_CUSTOMCSS', !windowOnTop);
                  }}
                  className='button'
                >
                  {windowOnTop ? <Icon name='UnpinLayer' /> : <Icon name='PinLayer' />}
                </Clickable>
              </Tooltip>}
              <Tooltip text={popout ? Messages.CLOSE_WINDOW : Messages.POPOUT_PLAYER} position='left'>
                <Clickable
                  onClick={() => popout
                    ? getModule('setAlwaysOnTop', 'open').close('DISCORD_VIZALITY_CUSTOMCSS')
                    : console.log('open popout')}
                  className='button'
                >
                  {popout ? <Icon name='Close' /> : <Icon name='Activity' />}
                </Clickable>
              </Tooltip>
            </div>
          </div>
          <div className='vizality-quickcss-editor'>
            {cmSettings && renderSettings()}
            <CodeMirror
              popout={popout}
              onReady={setupCodeMirror.bind(this)}
              getSetting={getSetting}
            />
          </div>
          <div className='vizality-quickcss-footer'>
            <span>{Messages.VIZALITY_QUICKCSS_AUTOCOMPLETE}</span>
            <span>CodeMirror v{require('codemirror').version}</span>
          </div>
          {!popout && <div className='vizality-quickcss-resizer' />}
        </>}
    </div>
  );
});
