/**
 * @deprecated:
 * @powercord: This function/module is only here to provide
 * backwards-compatability with Powercord plugins that may utilize it.
 *
 * There is no replacement for this as it has been removed entirely from Vizality,
 * due the seemingly niche nature of it. If you want it left in, let us know!
 */

/**
 * Converts milliseconds to hours:minutes:seconds
 * @param {*} time
 */

const logger = require('./logger');

const formatTime = (time) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Util:formatTime';

  logger.deprecate(MODULE, SUBMODULE, null);

  time = Math.floor(time / 1000);

  const hours = Math.floor(time / 3600) % 24;
  const minutes = Math.floor(time / 60) % 60;
  const seconds = time % 60;

  return [ hours, minutes, seconds ]
    .map(v => v < 10 ? `0${v}` : v)
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
};

module.exports = formatTime;
