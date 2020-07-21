const { getRandom, getContrasted } = require('../color');

const _parseType = require('./_parseType');

/**
 * Logs strings using different console levels, includes a badge, module label,
 * submodule label, and message.
 *
 * @param {string} module - Name of the calling module.
 * @param {any|Array<any>} message - Messages to have logged.
 * @param {module:logger.logTypes} type - Type of log to use in console.
 */
const _log = (module, submodule, submoduleColor, message, logType) => {
  logType = _parseType(logType);
  if (!Array.isArray(message)) message = [ message ];

  /*
   * module: '#591870',
   * submodule: '#ce03e5'
   */
  const BADGE_COLORS = {
    API: {
      module: '#dc2167',
      submodule: '#242a85'
    },
    HTTP: {
      module: '#ff683b',
      submodule: '#2e89c9'
    },
    Manager: {
      module: '#1e2963',
      submodule: '#782049'
    },
    Plugin: {
      module: '#057b81',
      submodule: '#5b3c89'
    },
    Theme: {
      module: '#e23773',
      submodule: '#568763'
    },
    Discord: {
      module: '#7289DA',
      submodule: '#d6409a'
    },
    Module: {
      module: '#e56e60',
      submodule: '#34426e'
    },
    Patcher: {
      module: '#a70338',
      submodule: '#0195b5'
    }
  };

  const randomModuleColor = getRandom();
  const randomSubmoduleColor = getRandom();

  const baseBadgeStyles =
    `border-radius: 3px;
    text-align: center;
    display: inline-block;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 700;
    line-height: 14px;
    margin-right: 3px;
    padding: 1px 4px;`;

  const badgeStyles =
    `background-image: url(https://i.imgur.com/t0eWy67.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    padding: 2px 14px 5px 0;
    border-radius: 5px;
    text-align: center;
    margin: 0 4px 1px 0;
    display: inline-block;`;

  const moduleStyles =
    `${baseBadgeStyles}
    color: ${BADGE_COLORS[module] && BADGE_COLORS[module].module ? getContrasted(BADGE_COLORS[module].module) : getContrasted(randomModuleColor)};
    background: ${BADGE_COLORS[module] && BADGE_COLORS[module].module || randomModuleColor};`;

  const submoduleStyles =
    `${baseBadgeStyles};
    color: ${submoduleColor ? getContrasted(submoduleColor) : BADGE_COLORS[module] && BADGE_COLORS[module].submodule ? getContrasted(BADGE_COLORS[module].submodule) : getContrasted(randomSubmoduleColor)};
    background: ${submoduleColor || BADGE_COLORS[module] && BADGE_COLORS[module].submodule || randomSubmoduleColor};`;

  return console[logType](
    `%c %c${module}%c${submodule}`,
    badgeStyles,
    moduleStyles,
    submoduleStyles,
    ...message
  );
};

module.exports = _log;
