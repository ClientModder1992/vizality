// const { Table } = require('@vizality/components');
const { React, React: { useState, useEffect } } = require('@vizality/react');
const { Icon, KeyboardShortcut, KeybindRecorder } = require('@vizality/components');
const { getModule } = require('@vizality/webpack');

const { EmbedVideo } = getModule(m => m.EmbedVideo);

module.exports = React.memo(() => {
  return (
    <>
      <EmbedVideo href='https://www.kelp.agency/wp-content/uploads/2020/06/orbit_1_1.webm' video={{ url: 'https://www.kelp.agency/wp-content/uploads/2020/06/orbit_1_1.webm', width: '800', height: '800' }} />
      <KeybindRecorder defaultValue={[]} />
      <KeyboardShortcut shortcut='ctrl+p' />
      <KeyboardShortcut shortcut='ctrl+l' />
      <KeyboardShortcut shortcut='ctrl+a' />
      <KeyboardShortcut shortcut='ctrl+y' />
    </>
  );
});
