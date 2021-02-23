/* eslint-disable no-unused-vars */
import { log, warn, error } from './Logger';
import { getModule } from '../webpack';

/**
 * Contains methods relating to time and dates.
 * @module util.time
 * @namespace util.time
 * @memberof util
 */

/** @private */
const _labels = [ 'Util', 'Time' ];
const _log = (labels, ...message) => log({ labels: labels || _labels, message });
const _warn = (labels, ...message) => warn({ labels: labels || _labels, message });
const _error = (labels, ...message) => error({ labels: labels || _labels, message });

/**
 * 
 * @param {*} ms 
 * @returns 
 */
export const millisecondsToTime = ms => {
  try {
    const time = getModule('momentProperties').duration(ms);
    let output;
    output = time.hours() ? time.hours() : null;
    if (time.minutes()) {
      output = output ? `${output}:${time.minutes()}` : time.minutes();
      if (time.seconds()) {
        output = output ? `${output}:${time.seconds()}` : time.seconds();
      } else {
        output = output ? `${output}:00` : '00';
      }
    } else {
      output = output ? `${output}:00` : '00';
    }
    return output;
  } catch (err) {
    return _error(_labels.concat('millisecondsToTime'), err);
  }
};

/**
 * 
 * @param {*} input 
 * @returns 
 */
export const isDate = input => {
  try {

  } catch (err) {
    return _error(_labels.concat('isDate'), err);
  }
};

/**
 * 
 * @param {*} input 
 * @returns 
 */
export const assertDate = input => {
  try {

  } catch (err) {
    return _error(_labels.concat('assertDate'), err);
  }
};

/**
 * 
 * @param {*} time 
 * @returns 
 */
export const sleep = async time => {
  try {
    return new Promise(resolve =>
      setTimeout(resolve, time)
    );
  } catch (err) {
    return _error(_labels.concat('sleep'), err);
  }
};

