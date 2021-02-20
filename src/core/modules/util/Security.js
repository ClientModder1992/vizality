/* eslint-disable no-unused-vars */
import { log, warn, error } from './Logger';

/**
 * Contains methods relating to security.
 * @module util.security
 * @namespace util.security
 * @memberof util
 */

/** @private */
const _module = 'Util';
const _submodule = 'Security';
const _log = (...message) => log({ module: _module, submodule: _submodule, message });
const _warn = (...message) => warn({ module: _module, submodule: _submodule, message });
const _error = (...message) => error({ module: _module, submodule: _submodule, message });
