// const { Table } = require('@vizality/components');
const { React, React: { useState, useEffect } } = require('@vizality/react');
const { Icon, KeyboardShortcut, KeybindRecorder } = require('@vizality/components');

module.exports = React.memo(() => {
  return (
    <>
      <KeybindRecorder defaultValue={[]} />
      <KeyboardShortcut shortcut='ctrl+p' />
      <KeyboardShortcut shortcut='ctrl+l' />
      <KeyboardShortcut shortcut='ctrl+a' />
      <KeyboardShortcut shortcut='ctrl+y' />
    </>
  );
});
