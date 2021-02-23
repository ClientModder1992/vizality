/* eslint-disable no-unused-vars */
import { log, warn, error } from './Logger';

/**
 * Contains methods relating to security.
 * @module util.security
 * @namespace util.security
 * @memberof util
 */

/** @private */
const _labels = [ 'Util', 'Security' ];
const _log = (labels, ...message) => log({ labels: labels || _labels, message });
const _warn = (labels, ...message) => warn({ labels: labels || _labels, message });
const _error = (labels, ...message) => error({ labels: labels || _labels, message });
