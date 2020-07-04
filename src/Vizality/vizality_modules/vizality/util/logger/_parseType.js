module.exports = (logType) => {
  const LOG_TYPES = {
    error: 'error',
    log: 'log',
    warn: 'warn'
  };

  return LOG_TYPES.hasOwnProperty(logType) ? LOG_TYPES[logType] : 'log';
};
