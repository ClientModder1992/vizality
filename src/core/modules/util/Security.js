/* eslint-disable no-unused-vars */
/**
 * Contains functions relating to security.
 * @module Security
 * @memberof Util
 * @namespace Util.Security
 * @version 1.0.0
 */

import { log, warn, error } from './Logger';

/** @private */
const _labels = [ 'Util', 'Security' ];
const _log = (labels, ...message) => log({ labels, message });
const _warn = (labels, ...message) => warn({ labels, message });
const _error = (labels, ...message) => error({ labels, message });
