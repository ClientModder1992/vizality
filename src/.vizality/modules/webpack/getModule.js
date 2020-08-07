const { array: { getLastElement } } = require('@utilities');

const _getMdl = require('./_getMdl');

const getModule = (...filter) => {
  let retry = false;
  let forever = false;

  if (typeof getLastElement(filter) === 'boolean') {
    forever = getLastElement(filter);
    filter.pop();
    if (typeof getLastElement(filter) === 'boolean') {
      retry = getLastElement(filter);
      filter.pop();
    } else {
      retry = forever;
      forever = false;
    }
  }

  if (typeof filter[0] === 'function') {
    ([ filter ] = filter); // Thanks Lighty, I still don't understand this syntax.
  }

  return _getMdl(filter, retry, forever, 'getModule', filter);
};

module.exports = getModule;
