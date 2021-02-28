/**
 * @todo There are some more things that need to be done for commands:
 * - An error occurs in console when you click a rail icon
 * - Add the ability to collapse categories (Discord hasn't even added this yet, though it's clear they intend to)
 * - There is a bug with arrow key navigation where the list doesn't scroll
 * - Consider adding a back arrow button to the header for subcommand autocompletes
 */

import React from 'react';

import { typing, getModule, getModuleByDisplayName, channels } from '@vizality/webpack';
import { getOwnerInstance, findInReactTree } from '@vizality/util/react';
import { AdvancedScrollerThin, LazyImage } from '@vizality/components';
import { toHash, isString } from '@vizality/util/string';
import { joinClassNames } from '@vizality/util/dom';
import { patch, unpatch } from '@vizality/patcher';
import { Vizality } from '@vizality/constants';
import { Builtin } from '@vizality/entities';
import { Messages } from '@vizality/i18n';

import CategoryTitle from './components/CategoryTitle';

export default class Commands extends Builtin {
  start () {
    vizality.api.commands.registerCommand({
      command: 'panic',
      description: 'Temporarily disables Vizality. Reload Discord to restore.',
      executor: async () => vizality.stop()
    });

    vizality.api.commands.registerCommand({
      command: 'relaunch',
      description: 'Forcefully relaunches Discord.',
      executor: async () => DiscordNative.app.relaunch()
    });

    this.showCommandRail = true;
    this.showCommandImages = false;
    this.monkeypatchMessages();
    this.patchAutocomplete();
  }

  stop () {
    vizality.api.commands.unregisterCommand('panic');
    vizality.api.commands.unregisterCommand('relaunch');
    unpatch('vz-commands-textArea');
    unpatch('vz-commands-plainAutocomplete');
    unpatch('vz-commands-slateAutocomplete');
    unpatch('vz-commands-autocomplete');
    unpatch('vz-commands-commandItem');
    unpatch('vz-commands-railIcon');
    unpatch('vz-commands-useCommandSection');
  }

  patchAutocomplete () {
    const ApplicationCommandDiscoveryApplicationIcon = getModule(m => m.default?.displayName === 'ApplicationCommandDiscoveryApplicationIcon');
    const ApplicationCommandDiscoverySectionList = getModuleByDisplayName('ApplicationCommandDiscoverySectionList');
    const { rail, wrapper, outerWrapper, list, categorySection, categorySectionLast } = getModule('rail');
    const ApplicationCommandItem = getModule(m => m.default?.displayName === 'ApplicationCommandItem');
    const { autocomplete: autocomplete2 } = getModule('autocomplete', 'stickerAutoComplete');
    const { AUTOCOMPLETE_OPTIONS: AutocompleteTypes } = getModule('AUTOCOMPLETE_OPTIONS');
    const ChannelEditorContainer = getModuleByDisplayName('ChannelEditorContainer');
    const selectedChannelStore = getModule('getChannelId', 'getVoiceChannelId');
    const SlateChannelTextArea = getModuleByDisplayName('SlateChannelTextArea');
    const { autocomplete, autocompleteInner } = getModule('autocompleteInner');
    const PlainTextArea = getModuleByDisplayName('PlainTextArea');
    const Autocomplete = getModuleByDisplayName('Autocomplete');
    const { textArea } = getModule('channelTextArea', 'inner');
    const { image, title } = getModule('image', 'infoWrapper');
    const { builtInSeparator } = getModule('builtInSeparator');
    const { autocompleteRow } = getModule('autocompleteRow');
    const useCommandSection = getModule('useCommandSection');
    const { listItems, scroller } = getModule('listItems');
    const channelStore = getModule('getChannel');
    const _this = this;

    const renderHeader = (value, formatHeader, addonName, icon, id) => {
      const title = value?.length > 0 ? Messages.COMMANDS_MATCHING.format({ prefix: formatHeader(value) }) : Messages.COMMANDS;
      if (title[1]?.props?.children) {
        title[1].props.children = value.length > 0 && `${vizality.api?.commands?.prefix}${value}`;
      }
      return (
        this.showCommandRail
          ? (
            <CategoryTitle icon={icon} id={id}>
              {addonName}
            </CategoryTitle>
          )
          : <Autocomplete.Title title={title} />
      );
    };

    const renderCommandResults = (value, selected, commands, onHover, onClick, formatCommand, formatHeader) => {
      if (!commands?.length) return null;
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
        this.showCommandImages = true;
        this.showCommandRail = true;
      // Else show the slate autocomplete with image icons
      } else {
        this.showCommandImages = false;
        this.showCommandRail = false;
      }

      const categorizedResults = [];
      const railSections = [];
      if (this.showCommandRail) {
        const callers = [];
        const vizalitySectionInner = [];
        vizalitySectionInner.push(renderHeader('', null, 'Vizality', `vz-asset://image/logo.png`, `vz-cmd-vizality`));
        results.forEach(result => {
          const { command } = findInReactTree(result, r => r.command);
          if (!callers.includes(command.caller) && command.caller !== 'vizality' && !Vizality.BUILTINS.includes(command.caller)) {
            callers.push(command.caller);
          }
          if (command.caller === 'vizality' || Vizality.BUILTINS.includes(command.caller)) {
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
            <div className={
              joinClassNames(
                categorySection, { [categorySectionLast]: section[0] === Object.entries(sections)[Object.entries(sections)?.length - 1][0] }
              )
            }>
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
        this.showCommandRail
          ? (
            <>
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
          )
          : (
            <AdvancedScrollerThin className={joinClassNames(scroller, list)} style={{ maxHeight: '376px' }}>
              {renderHeader(value, formatHeader)}
              {results}
            </AdvancedScrollerThin>
          )
      );
    };

    const getMatchingCommand = c => [ c.command, ...(c.aliases || []) ];

    AutocompleteTypes.VIZALITY_AUTOCOMPLETE = {
      autoSelect: true,
      getSentinel: () => vizality.api?.commands?.prefix,
      matches: (_channel, prefix, value, isAtStart, props) => props.canExecuteCommands && isAtStart && prefix === vizality.api?.commands?.prefix && vizality.api?.commands?.getCommand(c => c.autocomplete && (getMatchingCommand(c)).includes(value.split(' ')[0])),
      queryResults: (_channel, value) => {
        const currentCommand = vizality.api?.commands?.getCommand(c => (getMatchingCommand(c)).includes(value.split(' ')[0]));
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
          const currentCommand = vizality.api?.commands?.getCommand(c => (getMatchingCommand(c)).includes(value.split(' ')[0]));
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
          value = commands[index].command;
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
        commands: vizality.api?.commands?.getCommands(c => (getMatchingCommand(c)).some(commandName => commandName.includes(value)))
      }),
      renderResults: (_channel, value, selected, onHover, onClick, _state, _props, autocomplete) => {
        if (autocomplete && autocomplete.commands) {
          return renderCommandResults(value, selected, autocomplete.commands, onHover, onClick, c => ({
            key: `vizality-${c.command}`,
            command: {
              name: c.command,
              ...c
            }
          }), value => `${vizality.api?.commands?.prefix}${value}`);
        }
      },
      getPlainText: (index, _state, { commands }) => commands && commands[index] ? `${vizality.api?.commands?.prefix}${commands[index].command}` : '',
      getRawText (...args) {
        return this.getPlainText(...args);
      }
    };

    patch('vz-commands-textArea', ChannelEditorContainer.prototype, 'render', function () {
      _this.instance = this;
    });

    /* Silent command typing */
    typing.startTyping = (startTyping => channel => setImmediate(() => {
      try {
        if (this.instance?.props) {
          const { textValue } = this.instance.props;
          if (textValue) {
            const currentCommand = vizality.api?.commands?.getCommand(c => (getMatchingCommand(c)).includes(textValue.slice(vizality.api?.commands?.prefix?.length).split(' ')[0]));
            if (textValue.startsWith(vizality.api?.commands?.prefix) && (!currentCommand || (currentCommand && !currentCommand.showTyping))) {
              return typing.stopTyping(channel);
            }
            startTyping(channel);
          }
        }
      } catch (err) {
        this.error(err);
      }
    }))(this.oldStartTyping = typing.startTyping);

    patch('vz-commands-plainAutocomplete', PlainTextArea.prototype, 'getCurrentWord', function (_, res) {
      const { value } = this.props;
      if (new RegExp(`^\\${vizality.api?.commands?.prefix}\\S+ `).test(value)) {
        if ((/^@|#|:/).test(res.word)) return;
        return {
          word: value,
          isAtStart: true
        };
      }
    });

    patch('vz-commands-slateAutocomplete', SlateChannelTextArea.prototype, 'getCurrentWord', function (_, res) {
      const { value } = this.editorRef;
      const { selection, document } = value;
      if (new RegExp(`^\\${vizality.api?.commands?.prefix}\\S+ `).test(document.text)) {
        if ((/^@|#|:/).test(res.word)) return;
        const node = document.getNode(selection.start.key);
        if (node) {
          return {
            word: node.text.substring(0, selection.start.offset),
            isAtStart: true
          };
        }
      }
    });

    /**
     * Patch command items to add icons and sources to mimic Discord's slash command UI.
     */
    patch('vz-commands-commandItem', ApplicationCommandItem, 'default', ([ props ], res) => {
      const vizalityCommand = Boolean(props?.command?.caller);
      const plugin = vizality.manager?.plugins?.get(props?.command?.caller);

      if (vizalityCommand) {
        let commandText = findInReactTree(res, r => r.className === title);

        commandText = commandText.children.substring(1);

        if (this.showCommandRail) {
          commandText = `${vizality.api?.commands?.prefix}${commandText}`;
        }

        res.props.children[1].props.children[0].props.children[0].props.children = commandText;

        if (plugin) {
          if (!this.showCommandImages) {
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
          if (!this.showCommandImages) {
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
    });

    /**
     * Patch icons on the slash commands autocomplete rail.
     */
    patch('vz-commands-railIcon', ApplicationCommandDiscoveryApplicationIcon, 'default', ([ props ], res) => {
      // Check if it's a Vizality-specific icon
      if (props?.section?.icon?.includes('vz-plugin://') || props?.section?.icon?.includes('vz-asset://')) {
        res.props.onClick = () => {
          /**
           * Scrolls to the specific category section on click. Using DOM selectors here which is less than ideal.
           * @bug Currently it also throws an error in console, which does not affect any functionality.
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
    });

    patch('vz-commands-useCommandSection', useCommandSection, 'useCommandSection', args => {
      if (!args[0]) {
        args.unshift({ channel: channelStore.getChannel(selectedChannelStore.getChannelId()) });
      }
    }, true);
  }

  /**
   * @note We use bot.phone below to set the phone property of the bot message
   * which we can use later (in the builtin enhancements) to change the tag from BOT
   * to VIZALITY or PLUGIN.
   */
  async monkeypatchMessages () {
    try {
      const messages = getModule('sendMessage', 'editMessage');
      const { createBotMessage } = getModule('createBotMessage');
      const { BOT_AVATARS } = getModule('BOT_AVATARS');
      const { getChannelId } = channels;

      // Create a new `BOT_AVATARS` key called 'vizality' which we'll later use to replace Clyde.
      BOT_AVATARS.vizality = 'vz-asset://image/logo.png';

      messages.sendMessage = (sendMessage => async (id, message, ...params) => {
        if (!message.content.startsWith(vizality.api.commands?.prefix)) {
          return sendMessage(id, message, ...params).catch(err => this.error(err));
        }

        const [ cmd, ...args ] = message.content.slice(vizality.api.commands?.prefix.length).split(' ');
        const command = vizality.api.commands?.getCommand(c => [ c.command, ...(c.aliases || []) ].includes(cmd.toLowerCase()));

        if (!command) {
          return sendMessage(id, message, ...params).catch(err => this.error(err));
        }

        try {
          const result = await command.executor(args, this);
          if (!result) {
            return;
          }
          if (result.send) {
            message.content = result.result;
          } else {
            const receivedMessage = createBotMessage(getChannelId(), '');
            if (vizality.settings.get('replaceClyde', true)) {
              const plugin = vizality.manager.plugins.get(command.caller);
              const username = command.username ||
              (plugin && plugin.manifest.name) ||
              'Vizality';

              let botAvatarName = 'vizality';
              let botPhone = toHash('VIZALITY');

              if (plugin) {
                BOT_AVATARS[plugin.addonId] = command.avatar || plugin.manifest.icon;
                botAvatarName = plugin.addonId;
                botPhone = toHash('PLUGIN');
              }

              const avatar = command.avatar ||
              (vizality.manager.plugins.get(command.caller) &&
              vizality.manager.plugins.get(command.caller).manifest.icon) ||
              'vz-asset://image/logo.png';

              BOT_AVATARS[botAvatarName] = avatar;
              receivedMessage.author.username = username;
              receivedMessage.author.avatar = botAvatarName;
              receivedMessage.author.phone = botPhone;

              if (result.avatar_url) {
                BOT_AVATARS[result.username] = result.avatar_url;
                receivedMessage.author.avatar = result.username;
              }
            }

            if (isString(result.result)) {
              receivedMessage.content = result.result;
            } else {
              receivedMessage.embeds.push(result.result);
            }

            return (
              messages.receiveMessage(receivedMessage.channel_id, receivedMessage),
              delete BOT_AVATARS[result.avatar_url]
            );
          }
        } catch (err) {
          return this.error(err);
        }
        return sendMessage(id, message, ...params).catch(err => this.error(err));
      })(this.oldSendMessage = messages.sendMessage);
    } catch (err) {
      this.error(err);
    }
  }
}
