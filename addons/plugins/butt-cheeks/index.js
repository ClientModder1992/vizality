const { Plugin } = require('@entities');

module.exports = class ButtCheeks extends Plugin {
  startPlugin () {
    /*
     * Setting up the modules for the global vizality object
     * =====================================================
     */

    vizality.modules = {
      webpack: {
        modules: {}
      },
      classes: {},
      constants: {},
      discord: {},
      pie: {}
    };

    const Modules = vizality.modules;

    const Webpack = require('@webpack');
    Object.getOwnPropertyNames(Webpack)
      .filter(prop => prop.indexOf('_'))
      .forEach(e => {
        if (!e.indexOf('get')) {
          Modules.webpack[e] = Webpack[e];
        } else {
          Modules.webpack.modules[e] = Webpack[e];
        }
      });

    /*
     * Classes Module
     * -------
     */
    const Classes = require('@classes');
    Object.getOwnPropertyNames(Classes)
      .forEach(e => Modules.classes[e] = Classes[e]);

    /*
     * Constants Module
     * ---------
     */
    const Constants = require('@constants');
    Object.getOwnPropertyNames(Constants)
      .forEach(e => Modules.constants[e] = Constants[e]);

    /*
     * Discord Module
     * -------
     */
    const Discord = require('@discord');
    Object.getOwnPropertyNames(Discord)
      .filter(prop => prop.indexOf('_'))
      .forEach(e => Modules.discord[e] = Discord[e]);
    /*
     * Discord:settings Module
     * ----------------
     */
    const { settings: DiscordSettings } = require('@discord');
    Object.getOwnPropertyNames(DiscordSettings)
      .filter(prop => prop.indexOf('_'))
      .forEach(e => Modules.discord.settings[e] = DiscordSettings[e]);


    /*
     * @todo: Make this a Developer settings toggle to make modules more easily accessible in console
     * for (const mdl in Modules) {
     *   global.vz[mdl] = Modules[mdl];
     *   delete Modules[mdl];
     *   delete vizality.modules;
     * }
     */
  }
};
