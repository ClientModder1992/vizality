import React from 'react';

import { typing, getModule, getModuleByDisplayName } from '@vizality/webpack';
import { AdvancedScrollerThin } from '@vizality/components';
import { getOwnerInstance } from '@vizality/util/react';
import { patch } from '@vizality/patcher';
import { Messages } from '@vizality/i18n';

import Command from './components/Command';
import Title from './components/Title';

export default async function injectAutocomplete () {
  this.classes = {
    ...await getModule('channelTextArea', 'inner')
  };

  function renderHeader (value, formatHeader, customHeader) {
    const title = value.length > 0 ? Messages.COMMANDS_MATCHING.format({ prefix: formatHeader(value) }) : Messages.COMMANDS;

    return React.createElement(Title, {
      title: customHeader || [ 'Vizality ', title ]
    }, 'autocomplete-title-Commands');
  }

  function renderCommandResults (value, selected, commands, onHover, onClick, formatCommand, formatHeader, customHeader) {
    if (!commands || commands.length === 0) {
      return null;
    }

    const results = commands.map((command, index) => React.createElement(Command, Object.assign({
      onClick,
      onHover,
      selected: selected === index,
      index
    }, formatCommand(command, index))));

    return React.createElement(React.Fragment, {}, renderHeader(value, formatHeader, customHeader), results.length > 10
      ? React.createElement(AdvancedScrollerThin, { style: { height: '337px' } }, results)
      : results
    );
  }

  function getMatchingCommand (c) {
    return [ c.command.toLowerCase(), ...(c.aliases?.map(alias => alias.toLowerCase()) || []) ];
  }

  const { AUTOCOMPLETE_OPTIONS: AutocompleteTypes } = await getModule('AUTOCOMPLETE_OPTIONS');

  AutocompleteTypes.VIZALITY_AUTOCOMPLETE = {
    autoSelect: true,
    getSentinel: () => vizality.api.commands.prefix,
    matches: (_channel, prefix, value, isAtStart, props) => props.canExecuteCommands && isAtStart && prefix === vizality.api.commands.prefix && vizality.api.commands.filter(c => c.autocomplete).find(c => (getMatchingCommand(c)).includes(value.split(' ')[0])),
    queryResults: (_channel, value) => {
      const currentCommand = vizality.api.commands.find(c => (getMatchingCommand(c)).includes(value.split(' ')[0]));
      if (!currentCommand) {
        return false;
      }

      if (currentCommand.autocomplete) {
        const autocompleteRows = currentCommand.autocomplete(value.split(' ').slice(1));
        if (autocompleteRows) {
          autocompleteRows.commands.__header = [ autocompleteRows.header ];
          delete autocompleteRows.header;
        }
        return autocompleteRows;
      }
    },
    renderResults: (_channel, value, selected, onHover, onClick, _state, _props, autocomplete) => {
      if (autocomplete && autocomplete.commands) {
        const { commands } = autocomplete;
        const customHeader = Array.isArray(commands.__header) ? commands.__header : [ commands.__header ];

        return renderCommandResults(value, selected, commands, onHover, onClick, c => ({
          key: `vizality-${c.command}`,
          command: {
            name: c.command,
            ...c
          },
          prefix: value.split(' ')[0]
        }), () => void 0, customHeader);
      }
    },
    getPlainText: (index, _state, { commands }) => {
      let value = '';
      const instance = getOwnerInstance(document.querySelector(`.${this.classes.textArea}`));
      const currentText = instance.getCurrentWord().word;

      if (commands[index].wildcard) {
        value = currentText.split(' ').pop();
      } else if (commands[index].instruction) {
        value = '';
      } else {
        value = commands && commands[index] && currentText.split(' ').pop() !== commands[index].command
          ? commands[index].command
          : '';
      }
      const currentTextSplit = currentText.split(' ');
      return `${currentTextSplit.slice(0, currentTextSplit.length - 1).join(' ')} ${value}`;
    },
    getRawText (...args) {
      return this.getPlainText(...args);
    }
  };

  AutocompleteTypes.VIZALITY = {
    autoSelect: true,
    getSentinel: () => vizality.api.commands.prefix,
    matches: (_channel, prefix, _value, isAtStart, props) => props.canExecuteCommands && isAtStart && prefix === vizality.api.commands.prefix,
    queryResults: (_channel, value) => ({
      commands: vizality.api.commands.filter(c => (getMatchingCommand(c)).some(commandName => commandName.includes(value)))
    }),
    renderResults: (_channel, value, selected, onHover, onClick, _state, _props, autocomplete) => {
      if (autocomplete && autocomplete.commands) {
        return renderCommandResults(value, selected, autocomplete.commands, onHover, onClick, c => ({
          key: `vizality-${c.command}`,
          command: {
            name: c.command,
            ...c
          }
        }), (value) => `${vizality.api.commands.prefix}${value}`);
      }
    },
    getPlainText: (index, _state, { commands }) => commands && commands[index] ? `${vizality.api.commands.prefix}${commands[index].command}` : '',
    getRawText (...args) {
      return this.getPlainText(...args);
    }
  };

  const _this = this;
  const ChannelEditorContainer = await getModuleByDisplayName('ChannelEditorContainer');
  patch('vz-commands-textArea', ChannelEditorContainer.prototype, 'render', function (_, res) {
    _this.instance = this;
    return res;
  });

  /* Silent command typing */
  typing.startTyping = (startTyping => (channel) => setImmediate(() => {
    if (this.instance && this.instance.props) {
      const { textValue } = this.instance.props;
      const currentCommand = vizality.api.commands.find(c => (getMatchingCommand(c)).includes(textValue.slice(vizality.api.commands.prefix.length).split(' ')[0]));
      if (textValue.startsWith(vizality.api.commands.prefix) && (!currentCommand || (currentCommand && !currentCommand.showTyping))) {
        return typing.stopTyping(channel);
      }
      startTyping(channel);
    }
  }))(this.oldStartTyping = typing.startTyping);

  const PlainTextArea = await getModuleByDisplayName('PlainTextArea');
  patch('vz-commands-plainAutocomplete', PlainTextArea.prototype, 'getCurrentWord', function (_, res) {
    const { value } = this.props;
    if (new RegExp(`^\\${vizality.api.commands.prefix}\\S+ `).test(value)) {
      return {
        word: value,
        isAtStart: true
      };
    }
    return res;
  });

  const SlateChannelTextArea = await getModuleByDisplayName('SlateChannelTextArea');
  patch('vz-commands-slateAutocomplete', SlateChannelTextArea.prototype, 'getCurrentWord', function (_, res) {
    const { value } = this.editorRef;
    const { selection, document } = value;
    if (new RegExp(`^\\${vizality.api.commands.prefix}\\S+ `).test(document.text)) {
      const node = document.getNode(selection.start.key);
      if (node) {
        return {
          word: node.text.substring(0, selection.start.offset),
          isAtStart: true
        };
      }
    }
    return res;
  });
}
