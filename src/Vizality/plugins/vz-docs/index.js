const { Plugin } = require('vizality/entities');
const { inject, uninject } = require('vizality/injector');
const { getModule, getModuleByDisplayName } = require('vizality/webpack');

const DocsLayer = require('./components/DocsLayer');

module.exports = class Documentation extends Plugin {
  startPlugin () {
    this.loadStylesheet('scss/style.scss');
    this._addDocsItem();

    vizality.api.documentation = {
      open: () => this._openDocs(),
      /*
       * @todo:
       * openAsPopup: () => this._openDocsAsPopup(),
       */
      close: () => this._closeDocs()
    };
  }

  pluginWillUnload () {
    uninject('vz-docs-tab');
    delete vizality.api.documentation;
  }

  _openDocs () {
    const { pushLayer } = getModule('pushLayer');

    return setImmediate(() => pushLayer(DocsLayer));
  }

  _closeDocs () {
    const { popLayer } = getModule('popLayer');

    return popLayer();
  }

  _addDocsItem () {
    const SettingsView = getModuleByDisplayName('SettingsView');
    inject('vz-docs-tab', SettingsView.prototype, 'getPredicateSections', (_, sections) => {
      const changelog = sections.find(c => c.section === 'changelog');
      if (changelog) {
        sections.splice(
          sections.indexOf(changelog) - 1, 0,
          {
            section: 'vz-documentation',
            onClick: () => this._openDocs(),
            label: 'Documentation'
          }
        );
      }

      return sections;
    });
  }
};
