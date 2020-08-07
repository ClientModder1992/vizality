const { getModule, getModuleByDisplayName } = require('@webpack');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');

const DocsLayer = require('./components/DocsLayer');

class Documentation extends Plugin {
  onStart () {
    this.loadStylesheet('scss/style.scss');
    this._addDocsItem();

    vizality.api.router.registerShortcut('documentation', this._openDocs);
  }

  onStop () {
    unpatch('vz-docs-tab');
    vizality.api.router.unregisterShortcut('documentation');
  }

  _openDocs () {
    const { pushLayer } = getModule('pushLayer');

    return setImmediate(() => pushLayer(DocsLayer));
  }

  _addDocsItem () {
    const SettingsView = getModuleByDisplayName('SettingsView');
    patch('vz-docs-tab', SettingsView.prototype, 'getPredicateSections', (_, sections) => {
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
}

module.exports = Documentation;
