const { React, getModule, getModuleByDisplayName, i18n: { Messages } } = require('vizality/webpack');
const { Card } = require('vizality/components');
const { inject, uninject } = require('vizality/injector');
const { Plugin } = require('vizality/entities');
const { I18N_WEBSITE } = require('vizality/constants');

const strings = require('../../../../i18n');
const strOverrides = require('../../../../i18n/overrides');

const totalStrCount = Object.keys(strings['en-US']).length;

module.exports = class I18n extends Plugin {
  async startPlugin () {
    const FluxSettingsLocale = await getModuleByDisplayName('FluxContainer(UserSettingsLocale)', true);
    // noinspection JSPotentiallyInvalidConstructorUsage
    const SettingsLocale = React.createElement(FluxSettingsLocale)
      .type.prototype.render.call({ memoizedGetStateFromStores: () => ({}) });
    const { codeRedemptionRedirect } = await getModule([ 'codeRedemptionRedirect' ], true);
    inject('vz-i18n-psst', SettingsLocale.type.prototype, 'render', (_, res) => {
      if (!Messages.VIZALITY_I18N_CONTRIBUTE) {
        return res;
      }

      res.props.children.props.children.unshift(
        React.createElement(Card, {
          className: codeRedemptionRedirect,
          style: {
            marginTop: 0,
            marginBottom: 30
          }
        }, Messages.VIZALITY_I18N_CONTRIBUTE.format({ weblateUrl: I18N_WEBSITE }))
      );

      const OgList = res.props.children.props.children[2].type;
      res.props.children.props.children[2].type = class List extends OgList {
        render () {
          const radioRenderer = this.renderRadio;
          this.renderRadio = (props) => {
            const percentage = Math.floor(Object.keys(strings[props.value] || {}).length / totalStrCount * 100);
            const overrides = Object.keys(strOverrides[props.value] || {}).length;
            const res = radioRenderer(props);
            const OgItem = res.type;
            res.type = class Item extends OgItem {
              render () {
                const res = super.render();
                if (props.value === 'en-US') {
                  return res;
                }
                const { className } = res.props;
                res.props.className = null;
                return React.createElement('div', { className }, res, React.createElement(
                  'div', {
                    onClick: res.props.onClick,
                    className: 'vizality-text',
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      margin: '10px 10px 0px',
                      opacity: 0.6,
                      fontSize: 14
                    }
                  },
                  React.createElement('span', null, Messages.VIZALITY_I18N_TRANSLATED_PERCENTAGE.format({ translated: percentage })),
                  React.createElement('span', null, overrides > 0 && Messages.VIZALITY_I18N_TRANSLATED_OVERRIDES.format({ overrides })))
                );
              }
            };
            return res;
          };
          return super.render();
        }
      };
      return res;
    });
  }

  pluginWillUnload () {
    uninject('vz-i18n-psst');
  }
};
