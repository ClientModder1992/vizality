/* eslint-disable no-unused-vars */
import { log, warn, error } from './Logger';
import { getModule } from '../webpack';

/**
 * Contains methods relating to time and dates.
 * @module util.time
 * @namespace util.time
 * @memberof util
 */

const _module = 'Util';
const _submodule = 'Time';

/** @private */
const _log = (...data) => log({ module: _module, submodule: _submodule }, ...data);
const _warn = (...data) => warn({ module: _module, submodule: _submodule }, ...data);
const _error = (...data) => error({ module: _module, submodule: _submodule }, ...data);

export const millisecondsToTime = ms => {
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
};

export const add = date => {
  return void 0;
};

export const substract = date => {
  return void 0;
};

export const calendar = date => {
  return void 0;
};

export const isDate = input => {
  return void 0;
};

export const assertDate = input => {
  return void 0;
};

export const formatDate = date => {
  return void 0;
};

export const sleep = async time => {
  return new Promise(resolve =>
    setTimeout(resolve, time)
  );
};

