import React from 'react';

import { typing, getModule, getModuleByDisplayName } from '@vizality/webpack';
import { getOwnerInstance, findInReactTree } from '@vizality/util/react';
import { AdvancedScrollerThin, LazyImage } from '@vizality/components';
import { joinClassNames } from '@vizality/util/dom';
import { error } from '@vizality/util/logger';
import { patch } from '@vizality/patcher';
import { Messages } from '@vizality/i18n';

import CategoryTitle from './components/CategoryTitle';

const _module = 'Builtin';
const _submodule = 'Commands';
const _subsubmodule = 'injectAutocomplete';

/** @private */
const _error = (...data) => error({ module: _module, submodule: _submodule, subsubmodule: _subsubmodule }, ...data);

export default function injectAutocomplete () {
  const ApplicationCommandDiscoveryApplicationIcon = getModule(m => m.default?.displayName === 'ApplicationCommandDiscoveryApplicationIcon');
  const ApplicationCommandDiscoverySectionList = getModuleByDisplayName('ApplicationCommandDiscoverySectionList');
  const { rail, wrapper, outerWrapper, list, categorySection, categorySectionLast } = getModule('rail');
  const ApplicationCommandItem = getModule(m => m.default?.displayName === 'ApplicationCommandItem');
  const { AUTOCOMPLETE_OPTIONS: AutocompleteTypes } = getModule('AUTOCOMPLETE_OPTIONS');
  const ChannelEditorContainer = getModuleByDisplayName('ChannelEditorContainer');
  const SlateChannelTextArea = getModuleByDisplayName('SlateChannelTextArea');
  const { autocomplete, autocompleteInner } = getModule('autocompleteInner');
  const { autocomplete: autocomplete2 } = getModule('autocomplete', 'stickerAutoComplete');
  const PlainTextArea = getModuleByDisplayName('PlainTextArea');
  const Autocomplete = getModuleByDisplayName('Autocomplete');
  const { textArea } = getModule('channelTextArea', 'inner');
  const { image, title } = getModule('image', 'infoWrapper');
  const { builtInSeparator } = getModule('builtInSeparator');
  const { listItems, scroller } = getModule('listItems');
  const { autocompleteRow } = getModule('autocompleteRow');
  const _this = this;

  const renderHeader = (value, formatHeader, addonName, icon, id) => {
    const title = value?.length > 0 ? Messages.COMMANDS_MATCHING.format({ prefix: formatHeader(value) }) : Messages.COMMANDS;
    if (title[1]?.props?.children) {
      title[1].props.children = value.length > 0 && `${vizality.api?.commands?.prefix}${value}`;
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

    const results = commands.map((command, index) =>
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

    // If only the prefix is entered, show the slash command UI
    if (!value) {
      this.settings.set('showCommandImages', false);
      this.settings.set('showCommandRail', true);
      this.settings.set('private.pie', true);
    // Else show the slate autocomplete with image icons
    } else {
      this.settings.set('showCommandImages', true);
      this.settings.set('showCommandRail', false);
    }

    const categorizedResults = [];
    const railSections = [];
    if (this.settings.get('showCommandRail', true)) {
      const callers = [];
      const vizalitySectionInner = [];
      vizalitySectionInner.push(renderHeader('', null, 'Vizality', `vz-asset://image/logo.png`, `vz-cmd-vizality`));
      results.forEach(result => {
        const { command } = findInReactTree(result, r => r.command);
        if (!callers.includes(command.caller) && command.caller !== 'vizality') {
          callers.push(command.caller);
        }

        if (command.caller === 'vizality') {
          vizalitySectionInner.push(result);
        }
      });

      const sections = {};
      callers.forEach(caller => {
        const addon = vizality.manager?.plugins?.get(caller);
        if (!addon) return;
        sections[caller] = [];
        sections[caller].push(renderHeader(null, null, addon.manifest.name, addon.manifest.icon, `vz-cmd-${caller}`));
        results.forEach(result => {
          const { command } = findInReactTree(result, r => r.command);
          if (caller === command.caller) {
            sections[caller].push(result);
          }
        });
      });

      categorizedResults.push(
        <div className={joinClassNames(categorySection)}>
          {vizalitySectionInner}
        </div>
      );

      let index = 0;
      for (const section of Object.entries(sections)) {
        categorizedResults.push(
          <div className={joinClassNames(categorySection, { [categorySectionLast]: section[0] === Object.entries(sections)[Object.entries(sections).length - 1][0] })}>
            {section[1]}
          </div>
        );

        railSections.push({
          icon: vizality.manager?.plugins?.get(section[0]).manifest.icon,
          id: section[0],
          isBuiltIn: false,
          commandsAmount: section[1].length - 1,
          name: vizality.manager?.plugins?.get(section[0]).manifest.name,
          index
        });

        index++;
      }

      railSections.unshift({
        icon: 'vz-asset://image/logo.png',
        id: 'vizality',
        isBuiltIn: false,
        commandsAmount: vizalitySectionInner.length - 1,
        name: 'Vizality',
        index: index++
      });
    }

    return (
      this.settings.get('showCommandRail', true)
        ? <>
          <ApplicationCommandDiscoverySectionList
            activeSectionIndex={777}
            className={joinClassNames('vz-commands-rail', rail)}
            sections={railSections}
            children={<hr className={builtInSeparator} />}
          />
          <AdvancedScrollerThin className={joinClassNames(scroller, list)}>
            <div className={listItems}>
              {categorizedResults}
            </div>
          </AdvancedScrollerThin>
        </>
        : <AdvancedScrollerThin className={joinClassNames(scroller, list)} style={{ maxHeight: '376px' }}>
          {renderHeader(value, formatHeader)}
          {results}
        </AdvancedScrollerThin>
    );
  };

  const getMatchingCommand = c => {
    return [ c.command.toLowerCase(), ...(c.aliases?.map(alias => alias.toLowerCase()) || []) ];
  };

  AutocompleteTypes.VIZALITY_AUTOCOMPLETE = {
    autoSelect: true,
    getSentinel: () => vizality.api?.commands?.prefix,
    matches: (_channel, prefix, value, isAtStart, props) => props.canExecuteCommands && isAtStart && prefix === vizality.api?.commands?.prefix && vizality.api?.commands?.filter(c => c.autocomplete).find(c => (getMatchingCommand(c)).includes(value.split(' ')[0])),
    queryResults: (_channel, value) => {
      const currentCommand = vizality.api?.commands?.find(c => (getMatchingCommand(c)).includes(value.split(' ')[0]));
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
        const currentCommand = vizality.api?.commands?.find(c => (getMatchingCommand(c)).includes(value.split(' ')[0]));

        return renderCommandResults(value, selected, commands, onHover, onClick, c => ({
          key: `vizality-${c.command}`,
          command: {
            name: c.command,
            ...c,
            caller: currentCommand.caller
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
    getSentinel: () => vizality.api?.commands?.prefix,
    matches: (_channel, prefix, _value, isAtStart, props) => props.canExecuteCommands && isAtStart && prefix === vizality.api?.commands?.prefix,
    queryResults: (_channel, value) => ({
      commands: vizality.api?.commands?.filter(c => (getMatchingCommand(c)).some(commandName => commandName.includes(value)))
    }),
    renderResults: (_channel, value, selected, onHover, onClick, _state, _props, autocomplete) => {
      if (autocomplete && autocomplete.commands) {
        return renderCommandResults(value, selected, autocomplete.commands, onHover, onClick, c => ({
          key: `vizality-${c.command}`,
          command: {
            name: c.command,
            ...c
          }
        }), (value) => `${vizality.api?.commands?.prefix}${value}`);
      }
    },
    getPlainText: (index, _state, { commands }) => commands && commands[index] ? `${vizality.api?.commands?.prefix}${commands[index].command}` : '',
    getRawText (...args) {
      return this.getPlainText(...args);
    }
  };

  patch('vz-commands-textArea', ChannelEditorContainer.prototype, 'render', function (_, res) {
    _this.instance = this;
    return res;
  });

  /* Silent command typing */
  typing.startTyping = (startTyping => channel => setImmediate(() => {
    try {
      if (this.instance?.props) {
        const { textValue } = this.instance.props;
        if (textValue) {
          const currentCommand = vizality.api?.commands?.find(c => (getMatchingCommand(c)).includes(textValue.slice(vizality.api?.commands?.prefix?.length).split(' ')[0]));
          if (textValue.startsWith(vizality.api?.commands?.prefix) && (!currentCommand || (currentCommand && !currentCommand.showTyping))) {
            return typing.stopTyping(channel);
          }
          startTyping(channel);
        }
      }
    } catch (err) {
      _error(err);
    }
  }))(this.oldStartTyping = typing.startTyping);

  patch('vz-commands-plainAutocomplete', PlainTextArea.prototype, 'getCurrentWord', function (_, res) {
    const { value } = this.props;
    if (new RegExp(`^\\${vizality.api?.commands?.prefix}\\S+ `).test(value)) {
      return {
        word: value,
        isAtStart: true
      };
    }
    return res;
  });

  patch('vz-commands-slateAutocomplete', SlateChannelTextArea.prototype, 'getCurrentWord', function (_, res) {
    const { value } = this.editorRef;
    const { selection, document } = value;
    if (new RegExp(`^\\${vizality.api?.commands?.prefix}\\S+ `).test(document.text)) {
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

  patch('vz-commands-commandItem', ApplicationCommandItem, 'default', ([ props ], res) => {
    const vizalityCommand = Boolean(props?.command?.caller);
    const plugin = vizality.manager?.plugins?.get(props?.command?.caller);

    if (vizalityCommand) {
      let commandText = findInReactTree(res, r => r.className === title);

      commandText = commandText.children.substring(1);

      if (this.settings.get('showCommandRail', true)) {
        commandText = `${vizality.api?.commands?.prefix}${commandText}`;
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
                src={props?.command?.icon || 'vz-asset://image/logo.png'}
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

  /**
   * Patch icons on the slash commands autocomplete rail.
   */
  patch('vz-commands-railIcon', ApplicationCommandDiscoveryApplicationIcon, 'default', ([ props ], res) => {
    // Check if it's a Vizality-specific icon
    if (props?.section?.icon?.includes('vz-plugin://') || props?.section?.icon?.includes('vz-asset://')) {
      res.props.onClick = () => {
        /**
         * Scrolls to the specific category section on click. Using DOM selectors here which is not optimal.
         * @bug Currently it also throws an error in console, which does not affect anything.
         */
        let topOfElement = document.querySelector(`#vz-cmd-${props?.section?.id}`).offsetTop;
        const scroller = document.querySelector(`.vz-commands-autocomplete .${list}`);
        const row = document.querySelector(`.${autocompleteRow}`);
        const { scrollTop } = scroller;
        if (scrollTop > topOfElement && row) {
          topOfElement -= row.offsetHeight * props?.section?.commandsAmount;
        }

        scroller.scroll({ top: topOfElement, behavior: 'smooth' });
      };

      res.props.children.props.children.props.src = props?.section?.icon;
    }

    return res;
  });

  /**
   * @note Patching the autocomplete menu to add some classes to make the Vizality
   * commands autocomplete replicate the classes of Discord's slash commands
   * autocomplete perfectly. We also add a couple of our own utility classes/attributes, like
   * [vz-rail-active], .vz-commands-autocomplete, and .vz-commands-rail
   */
  patch('vz-commands-autocomplete', Autocomplete.prototype, 'render', (_, res) => {
    const _autocompleteInner = findInReactTree(res, r => r.className?.includes(autocompleteInner) && !r.className?.includes(wrapper));
    const _autocomplete = findInReactTree(res, r => r.className?.includes(autocomplete) && !r.className?.includes(outerWrapper));
    const _rail = findInReactTree(res, r => r.className?.includes('vz-commands-rail'));

    // Target the autocompleteInner div
    if (_autocompleteInner) {
      _autocompleteInner.className = joinClassNames(_autocompleteInner.className, {
        [wrapper]: Boolean(_rail)
      });
    }

    // Target the autocomplete div
    if (_autocomplete) {
      res.props['vz-rail-active'] = Boolean(_rail) && '';
      _autocomplete.className = joinClassNames(
        'vz-commands-autocomplete',
        autocomplete, {
          [outerWrapper]: Boolean(_rail),
          [autocomplete2]: Boolean(!_rail)
        });
    }

    return res;
  });

  const pie = getModule('useCommandSection');
  patch('ez-pie', pie, 'useCommandSection', (args, res) => {
    return res;
  });
}
