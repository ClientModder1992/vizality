/* eslint-disable no-unused-vars */
/**
 * Contains methods relating to security.
 * @module Security
 * @memberof Util
 * @namespace Util.Security
 * @version 1.0.0
 */

import { log, warn, error } from './Logger';

/** @private */
const _labels = [ 'Util', 'Security' ];
const _log = (labels, ...message) => log({ labels: labels || _labels, message });
const _warn = (labels, ...message) => warn({ labels: labels || _labels, message });
const _error = (labels, ...message) => error({ labels: labels || _labels, message });
