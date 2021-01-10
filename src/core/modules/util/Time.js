/* eslint-disable no-unused-expressions *//* eslint-disable no-unused-vars */
import { getModule } from '../webpack';

/**
 * @module util.time
 * @namespace util.time
 * @memberof util
 * @version 0.0.1
 */

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
