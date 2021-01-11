import React from 'react';

import { typing, getModule, getModuleByDisplayName } from '@vizality/webpack';
import { getOwnerInstance, findInReactTree } from '@vizality/util/react';
import { AdvancedScrollerThin, LazyImage } from '@vizality/components';
import { joinClassNames } from '@vizality/util/dom';
import { patch } from '@vizality/patcher';
import { Messages } from '@vizality/i18n';

import CategoryTitle from './components/CategoryTitle';

export default function injectAutocomplete () {
  const ApplicationCommandDiscoverySectionList = getModuleByDisplayName('ApplicationCommandDiscoverySectionList');
  const Autocomplete = getModuleByDisplayName('Autocomplete');
  const { categorySection, categorySectionLast } = getModule('categorySection');
  const { textArea } = getModule('channelTextArea', 'inner');
  const { builtInSeparator } = getModule('builtInSeparator');
  const { listItems, scroller } = getModule('listItems');
  const { autocomplete } = getModule('autocomplete');
  const { rail, wrapper, outerWrapper, list } = getModule('rail');
  const _this = this;

  const renderHeader = (value, formatHeader, addonName, icon, id) => {
    const title = value?.length > 0 ? Messages.COMMANDS_MATCHING.format({ prefix: formatHeader(value) }) : Messages.COMMANDS;
    if (title[1]?.props?.children) {
      title[1].props.children = value.length > 0 && `${vizality.api.commands.prefix}${value}`;
    }

    return this.settings.get('showCommandRail', true)
      ? <CategoryTitle icon={icon} id={id}>
        {addonName}
      </CategoryTitle>
      : <Autocomplete.Title title={title} />;
  };

  const renderCommandResults = (value, selected, commands, onHover, onClick, formatCommand, formatHeader) => {
    if (!commands || commands.length === 0) {
      return null;
    }

    const results = commands.slice(0).reverse().map((command, index) =>
      <>
        <Autocomplete.NewCommand
          onClick={onClick}
          onHover={onHover}
          selected={selected === index}
          index={index}
          {...formatCommand(command, index)}
        />
      </>
    );

    if (!value) { // If only the prefix is entered, show the "slash command" UI
      this.settings.set('showCommandImages', false);
      this.settings.set('showCommandRail', true);
    } else { // Else show the slate autocomplete with image icons
      this.settings.set('showCommandImages', true);
      this.settings.set('showCommandRail', false);
    }

    const categorizedResults = [];
    const railSections = [];
    if (this.settings.get('showCommandRail', true)) {
      const origins = [];
      const vizalitySectionInner = [];
      vizalitySectionInner.push(renderHeader('', null, 'Vizality', `vz-asset://images/logo.png`, `vz-cmd-vizality`));
      results.forEach(result => {
        const { command } = findInReactTree(result, r => r.command);
        if (!origins.includes(command.origin) && command.origin !== 'vizality') {
          origins.push(command.origin);
        }

        if (command.origin === 'vizality') {
          vizalitySectionInner.push(result);
        }
      });

      const sections = {};
      origins.forEach(origin => {
        const addon = vizality.manager.plugins.get(origin);
        if (!addon) return;
        sections[origin] = [];
        sections[origin].push(renderHeader(null, null, addon.manifest.name, addon.manifest.icon, `vz-cmd-${origin}`));
        results.forEach(result => {
          const { command } = findInReactTree(result, r => r.command);
          if (origin === command.origin) {
            sections[origin].push(result);
          }
        });
      });

      let index = 0;
      for (const section of Object.entries(sections)) {
        categorizedResults.push(
          <div className={categorySection}>
            {section[1]}
          </div>
        );

        railSections.push({
          icon: vizality.manager.plugins.get(section[0]).manifest.icon,
          id: section[0],
          isBuiltIn: false,
          commandsAmount: section[1].length - 1,
          name: vizality.manager.plugins.get(section[0]).manifest.name,
          index
        });

        index++;
      }

      categorizedResults.push(
        <div className={joinClassNames(categorySection, categorySectionLast)}>
          {vizalitySectionInner}
        </div>
      );

      railSections.push({
        icon: 'vz-asset://images/logo.png',
        id: 'vizality',
        isBuiltIn: false,
        commandsAmount: vizalitySectionInner.length - 1,
        name: 'Vizality',
        index: index++
      });
    }

    const CommandsRail = () =>
      <ApplicationCommandDiscoverySectionList
        activeSectionIndex={777} // this.settings.get('selectedRailItemIndex', 0)
        className={joinClassNames('vz-commands-rail', rail)}
        sections={railSections}
        children={<hr className={builtInSeparator} />}
      />;

    return (
      this.settings.get('showCommandRail', true)
        ? <>
          <CommandsRail />
          <AdvancedScrollerThin className={joinClassNames(scroller, list)}>
            <div className={listItems} style={{ inset: '8px 8px 0px' }}>
              {categorizedResults}
            </div>
          </AdvancedScrollerThin>
        </>
        : <div className={joinClassNames('vz-commands-autocomplete')}>
          <AdvancedScrollerThin className={joinClassNames(scroller, list)} style={{ maxHeight: '376px' }}>
            {renderHeader(value, formatHeader)}
            {results}
          </AdvancedScrollerThin>
        </div>
    );
  };

  const getMatchingCommand = c => {
    return [ c.command.toLowerCase(), ...(c.aliases?.map(alias => alias.toLowerCase()) || []) ];
  };

  const { AUTOCOMPLETE_OPTIONS: AutocompleteTypes } = getModule('AUTOCOMPLETE_OPTIONS');

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
        const currentCommand = vizality.api.commands.find(c => (getMatchingCommand(c)).includes(value.split(' ')[0]));

        return renderCommandResults(value, selected, commands, onHover, onClick, c => ({
          key: `vizality-${c.command}`,
          command: {
            name: c.command,
            ...c,
            origin: currentCommand.origin
          },
          prefix: value.split(' ')[0]
        }), () => void 0);
      }
    },
    getPlainText: (index, _state, { commands }) => {
      let value = '';
      const instance = getOwnerInstance(document.querySelector(`.${textArea}`));
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

  const ChannelEditorContainer = getModuleByDisplayName('ChannelEditorContainer');
  patch('vz-commands-textArea', ChannelEditorContainer.prototype, 'render', function (_, res) {
    _this.instance = this;
    return res;
  });

  /* Silent command typing */
  typing.startTyping = (startTyping => channel => setImmediate(() => {
    if (this.instance && this.instance.props) {
      const { textValue } = this.instance.props;
      const currentCommand = vizality.api.commands.find(c => (getMatchingCommand(c)).includes(textValue.slice(vizality.api.commands.prefix.length).split(' ')[0]));
      if (textValue.startsWith(vizality.api.commands.prefix) && (!currentCommand || (currentCommand && !currentCommand.showTyping))) {
        return typing.stopTyping(channel);
      }
      startTyping(channel);
    }
  }))(this.oldStartTyping = typing.startTyping);

  const PlainTextArea = getModuleByDisplayName('PlainTextArea');
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

  const SlateChannelTextArea = getModuleByDisplayName('SlateChannelTextArea');
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

  const ApplicationCommandItem = getModule(m => m.default?.displayName === 'ApplicationCommandItem');
  const { image, title } = getModule('image', 'infoWrapper');
  patch('vz-commands-commandItem', ApplicationCommandItem, 'default', ([ props ], res) => {
    const vizalityCommand = Boolean(props?.command?.origin);
    const plugin = vizality.manager.plugins.get(props?.command?.origin);

    if (vizalityCommand) {
      let commandText = findInReactTree(res, r => r.className === title);

      commandText = commandText.children.substring(1);

      if (this.settings.get('showCommandRail', true)) {
        commandText = `${vizality.api.commands.prefix}${commandText}`;
      }

      res.props.children[1].props.children[0].props.children[0].props.children = commandText;

      if (plugin) {
        if (this.settings.get('showCommandImages', false)) {
          res.props.children[0] =
            <div className={image}>
              <LazyImage
                className='vz-command-icon'
                src={props?.command?.icon || plugin.manifest.icon}
                width='32'
                height='32'
              />
            </div>;
        }

        res.props.children[2].props.children = props?.command?.source || plugin.manifest.name;
      } else {
        if (this.settings.get('showCommandImages', false)) {
          res.props.children[0] =
            <div className={image}>
              <LazyImage
                className='vz-command-icon'
                src={props?.command?.icon || 'vz-asset://images/logo.png'}
                width='32'
                height='32'
              />
            </div>;
        }
        res.props.children[2].props.children = props?.command?.source || 'Vizality';
      }
    }

    return res;
  });

  const ApplicationCommandDiscoveryApplicationIcon = getModule(m => m.default?.displayName === 'ApplicationCommandDiscoveryApplicationIcon');
  const { autocompleteRow } = getModule('autocompleteRow');
  patch('vz-commands-railIcon', ApplicationCommandDiscoveryApplicationIcon, 'default', ([ props ], res) => {
    let { src } = findInReactTree(res, r => r.src);
    if (src.includes('vz-plugin://') || src.includes('vz-asset://')) {
      res.props.onClick = () => {
        let topOfElement = document.querySelector(`#vz-cmd-${props?.section?.id}`).offsetTop;
        const scroller = document.querySelector('.vz-commands-autocomplete > .scrollerBase-289Jih');
        const row = document.querySelector(`.${autocompleteRow}`);
        const { scrollTop } = scroller;
        if (scrollTop > topOfElement && row) {
          topOfElement -= row.offsetHeight * props?.section?.commandsAmount;
        }

        document.querySelector('.vz-commands-autocomplete > .scrollerBase-289Jih').scroll({ top: topOfElement, behavior: 'smooth' });
        // this.settings.set('selectedRailItemIndex', props?.section?.index);
      };

      src = src.split('.webp');
      if (new RegExp(`https://cdn.discordapp.com/app-icons/(.*)/`).test(src[0])) {
        res.props.children.props.children.props.src = src[0].replace(new RegExp(`https://cdn.discordapp.com/app-icons/([^/]+)/`, 'ig'), '');
      }
    }

    return res;
  });

  patch('vz-commands-autocomplete', Autocomplete.prototype, 'render', (args, res) => {
    console.log(res);

    // vz-commands-autocomplete
    // wrapper
    // outerWrapper
    // autocomplete
    return res;
  });
}