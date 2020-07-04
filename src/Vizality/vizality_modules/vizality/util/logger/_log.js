const _parseType = require('./_parseType');
const color = require('../color');

/**
 * Logs strings using different console levels, includes a badge, module label,
 * submodule label, and message.
 *
 * @param {string} module - Name of the calling module.
 * @param {any|Array<any>} message - Messages to have logged.
 * @param {module:logger.logTypes} type - Type of log to use in console.
 */
module.exports = (module, submodule, submoduleColor, message, logType = 'log') => {
  logType = _parseType(logType);
  if (!Array.isArray(message)) message = [ message ];

  const BADGE_COLORS = {
    API: {
      module: '#8a50cc',
      submodule: '#15819c'
    },
    HTTP: {
      module: '#3636e0',
      submodule: '#cf3e0b'
    },
    Plugin: {
      module: '#d021a1',
      submodule: '#158547'
    },
    Theme: {
      module: '#90b900',
      submodule: '#6b159c'
    },
    Discord: {
      module: '#7289DA',
      submodule: '#6e5a00'
    },
    Module: {
      module: '#159c81',
      submodule: '#f21956'
    }
  };

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
    color: #fff;
    background: ${BADGE_COLORS[module].module || '#000'};`;

  const submoduleStyles =
    `${baseBadgeStyles};
    color: ${submoduleColor ? color.contrast(submoduleColor) : '#fff'};
    background: ${submoduleColor || BADGE_COLORS[module].submodule || '#000'};`;

  return console[logType](
    `%c %c${module}%c${submodule}%c`,
    badgeStyles,
    moduleStyles,
    submoduleStyles,
    '', // clear the styles of the 'message'
    ...message
  );
};
