const { React, getModule, i18n: { Messages } } = require('@webpack');
const { GUILD: { CHANNEL: { CSS_SNIPPETS_CHANNEL } } } = require('@constants');
const { react : { findInReactTree } } = require('@utilities');
const { PopoutWindow } = require('@components');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');

const { promises: { writeFile, readFile, readdir }, existsSync, unlink } = require('fs');
const { join } = require('path');

const SnippetButton = require('./components/SnippetButton');
const CustomCSS = require('./components/CustomCSS');

class CustomCSSPlugin extends Plugin {
  async onStart () {
    vizality.api.settings.registerSettings('Custom CSS', {
      category: 'vz-custom-css',
      label: () => 'Custom CSS',
      render: (props) => React.createElement(CustomCSS, {
        openPopout: () => this._openCustomCSSPopout(),
        ...props
      })
    });

    this.snippets = {};
    this.snippetsDirectory = join(__dirname, 'custom-css', 'snippets/');
    await this._readSnippets();

    this._customCSS = '';
    this._customCSSFile = join(__dirname, 'custom-css', 'style.scss');
    await this._loadCustomCSS();

    this._injectSnippetsButton();
    this.injectStyles('custom-css/style.scss');
    this.injectStyles('scss/style.scss');
  }

  onStop () {
    vizality.api.settings.unregisterSettings('Custom CSS');
    unpatch('vz-custom-css-snippets');
  }

  async _readSnippets () {
    try {
      const filenames = await readdir(this.snippetsDirectory);
      for (let filename of filenames) {
        try {
          const content = await readFile(this.snippetsDirectory + filename, 'utf-8');
          filename = filename.split('.').slice(0, -1).join('.');
          this.snippets[filename] = content;
        } catch (err) {
          // @todo: Handle this.
          console.log('Bollocks', err);
        }
      }
    } catch (err) {
      // @todo: Handle this.
      console.log('Ladies and gentlemen, we failed', err);
    }
  }

  async _injectSnippetsButton () {
    const MiniPopover = getModule(m => m.default && m.default.displayName === 'MiniPopover');
    patch('vz-custom-css-snippets', MiniPopover, 'default', (_, res) => {
      const props = findInReactTree(res, r => r && r.message && r.setPopout);

      if (!props || props.channel.id !== CSS_SNIPPETS_CHANNEL) return res;

      res.props.children.unshift(
        React.createElement(SnippetButton, {
          message: props.message,
          main: this
        })
      );

      return res;
    });
  }

  async _applySnippet (message) {
    const channelName = getModule('getChannel').getChannel(message.channel_id).name;
    const snippetId = message.id;

    let snippet = `\n\n/**\n`;
    snippet += ` * ${Messages.VIZALITY_SNIPPET_ID.format({ messageId: message.id })}\n`;
    snippet += ` * ${Messages.VIZALITY_SNIPPET_FROM.format({ channelName })}\n`;
    snippet += ` * ${Messages.VIZALITY_SNIPPET_DATE_APPLIED.format({ date: new Date() })}\n`;
    snippet += ` * ${Messages.VIZALITY_SNIPPET_CREATED_BY.format({ authorTag: message.author.tag, authorId: message.author.id })}\n`;
    snippet += ' */\n';

    for (const m of message.content.matchAll(/```((?:s?css))\n?([\s\S]*)`{3}/ig)) {
      const snippetCode = m[2].trim();
      snippet += `${snippetCode}`;
    }

    await this._saveSnippet(snippetId, snippet);
    await this._saveCustomCSS(this._customCSS + snippet);
  }

  async _removeSnippet (message) {
    const snippetId = message.id;
    const snippetFile = join(__dirname, 'custom-css', 'snippets', `_${snippetId}.scss`);

    const snippetValue = this.snippets[`_${snippetId}`];

    if (snippetValue) {
      // Remove all possible instances of the snippet...
      while (this._customCSS.indexOf(snippetValue.trim()) > -1) {
        this._customCSS = this._customCSS.replace(snippetValue.trim(), '');
      }

      await this._saveCustomCSS(this._customCSS);

      delete this.snippets[`_${snippetId}`];

      unlink(snippetFile, err => {
        if (err) throw this.error(`There was a problem deleting the file  _${snippetId}.scss:`, err);
        this.log(`Snippet ${snippetId} has been removed from your Custom CSS.`);
      });
    }
  }

  async _saveSnippet (snippetId, snippet) {
    const snippetFile = join(__dirname, 'custom-css', 'snippets', `_${snippetId}.scss`);
    await writeFile(snippetFile, snippet);
    this.snippets[`_${snippetId}`] = snippet;
  }

  async _loadCustomCSS () {
    if (existsSync(this._customCSSFile)) {
      this._customCSS = await readFile(this._customCSSFile, 'utf8');

      const snippets = Object.values(this.snippets);

      for (const snippet of snippets) {
        if (!this._customCSS.includes(snippet)) {
          this._customCSS += `${snippet}\n\n`;
        }
      }
    }

    this._saveCustomCSS(this._customCSS);
  }

  async _saveCustomCSS (css) {
    this._customCSS = css.trim();
    await writeFile(this._customCSSFile, this._customCSS);
  }

  async _openCustomCSSPopout () {
    const popoutModule = getModule('setAlwaysOnTop', 'open');
    popoutModule.open('DISCORD_VIZALITY_CUSTOMCSS', (key) => (
      React.createElement(PopoutWindow, {
        windowKey: key,
        title: 'Custom CSS'
      }, React.createElement(CustomCSS, { popout: true }))
    ));
  }
}

module.exports = CustomCSSPlugin;
