// const { Table } = require('@vizality/components');
const { React, React: { useState, useEffect } } = require('@vizality/react');
const { Icon, KeyboardShortcut, KeybindRecorder, Avatar } = require('@vizality/components');
const { getModule, getModuleByDisplayName } = require('@vizality/webpack');

const { EmbedVideo } = getModule(m => m.EmbedVideo);

const KeybindEntry = getModuleByDisplayName('FluxContainer(UserSettingsKeybinds)').prototype.render.call({ memoizedGetStateFromStores: () => {} }).type.prototype.renderKeybinds.call({ props: {} }, [ [] ])[0].props.children.type;

module.exports = React.memo(() => {
  return (
    <>
      <Avatar
        isTyping={true}
        isMobile={true}
        src='https://cdn.discordapp.com/avatars/597905003717459968/74809b431684d381a5ed0637f8adbf91.png'
        status='online'
        statusTooltip={true}
        size='SIZE_32'
      />
      <KeybindEntry
        keybind={{ managed: false, id: '1', action: 'TOGGLE_MUTE', shortcut: [] }}
        keybindActionTypes={[
          { label: 'Unassigned', value: 'UNASSIGNED' },
          { label: 'Push to Talk (Normal)', value: 'TOGGLE_MUTE' }
        ]}
        keybindDescriptions={{
          UNASSIGNED: 'Navigate backward in page history',
          TOGGLE_MUTE: 'asdasd asda dasda ds'
        }}
      />
      <video autoPlay loop autoPictureInPicture controls={false}>
        <source src="https://www.kelp.agency/wp-content/uploads/2020/06/orbit_1_1.webm" type="video/webm" />
      </video>
      <KeybindRecorder defaultValue={[]} />
      <KeyboardShortcut shortcut='ctrl+p' />
      <KeyboardShortcut shortcut='ctrl+l' />
      <KeyboardShortcut shortcut='ctrl+a' />
      <KeyboardShortcut shortcut='ctrl+y' />
    </>
  );
});
