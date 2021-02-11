/* eslint-disable no-unused-vars *//* eslint-disable no-undef *//* eslint-disable no-empty-function */
import { performance, PerformanceObserver } from 'perf_hooks';

import { getMedian, getAverage } from './Number';
import { log, warn, error } from './Logger';

/**
 * @module util.performance
 * @namespace util.performance
 * @memberof util
 */

const _module = 'Util';
const _submodule = 'Performance';

const _log = (...data) => log({ module: _module, submodule: _submodule }, ...data);
const _warn = (...data) => warn({ module: _module, submodule: _submodule }, ...data);
const _error = (...data) => error({ module: _module, submodule: _submodule }, ...data);

/**
 * Runs a function or set over function a specified number of times and then reports
 * the average and median run times of each function, and if multiple functions are specified
 * it shows a comparison table of each function's performance.
 * * Sourced from @see {@link https://github.com/Kyza/ittai/blob/75039f97dcfda4fc80690b00ff8a319fb0539fa0/core/utils/index.js#L176}
 * @param {Function|Array<Function>} code Code to benchmark.
 * @param {number} [iterations=1000] Amount of times to run the benchmark
 * @param {boolean} [nonoseconds=false] Whether to show output in nanoseconds or milliseconds
 * @param {boolean} [showLog=true] Whether to show a console log of the benchmark
 * @returns {Promise} A promise that resolves when the benchmark is completed
 */
export const benchmark = (code, iterations = 1000, nonoseconds = false, showLog = true) => {
  try {
    return new Promise((resolve) => {
      const pre = code.pre ?? (() => {});
      delete code.pre;
      const post = code.post ?? (() => {});
      delete code.post;

      const name = Object.keys(code)[0];
      code = code[Object.keys(code)[0]];
      const promises = [];

      const toNanoseconds = () => {
        const hrTime = process.hrtime();
        return hrTime[0] * 1000000000 + hrTime[1];
      };

      for (let i = 0; i < iterations; i++) {
        promises.push(
          new Promise((resolve) => {
            let returns, start, end;
            try {
              pre();
              start = toNanoseconds();
              returns = code();
              end = toNanoseconds();
              post();
            } catch (err) {
              resolve({ returns, time: 0, error: err });
            }
            resolve({ returns, time: end - start, error: false });
          })
        );
      }

      Promise.all(promises).then((allReturns) => {
        const finalTimes = allReturns.map((r) => r.time);
        resolve({
          name,
          average: getAverage(finalTimes),
          median: getMedian(finalTimes),
          error: allReturns[0].error,
          returns: allReturns[0].returns
        });
      });
    });
  } catch (err) {
    return _error(err);
  }
};
