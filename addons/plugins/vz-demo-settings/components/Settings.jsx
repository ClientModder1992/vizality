const { Confirm, settings: { TextInput, SwitchItem, ButtonItem, Category } } = require('@components');
const { open: openModal, close: closeModal } = require('vizality/modal');
const { React, React: { useState } } = require('@react');
const { Directories } = require('@constants');
const { getModule } = require('@webpack');
const { Messages } = require('@i18n');

module.exports = React.memo(({ getSetting, toggleSetting, updateSetting }) => {
  return (
    <div>
      <TextInput
        defaultValue={getSetting('prefix', '.')}
        onChange={p => updateSetting('prefix', !p ? '.' : p.replace(/\s+(?=\S)|(?<=\s)\s+/g, '').toLowerCase())}
        onBlur={({ target }) => target.value = getSetting('prefix', '.')}
        error={getSetting('prefix', '.') === '/' ? 'Prefix should not be set to `/` as it is already in use by Discord and may disable Vizality autocompletions.' : ''}
      >
        {Messages.VIZALITY_COMMAND_PREFIX}
      </TextInput>
    </div>
  );
});
