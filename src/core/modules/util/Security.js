/* eslint-disable no-unused-vars */
import { log, warn, error } from './Logger';

/**
 * Contains methods relating to security.
 * @module util.security
 * @namespace util.security
 * @memberof util
 */

const _module = 'Util';
const _submodule = 'Security';

/** @private */
const _log = (...data) => log({ module: _module, submodule: _submodule }, ...data);
const _warn = (...data) => warn({ module: _module, submodule: _submodule }, ...data);
const _error = (...data) => error({ module: _module, submodule: _submodule }, ...data);
