/* eslint-disable no-undef */
import { performance, PerformanceObserver } from 'perf_hooks';

/**
 * Benchmarks an array of functions and sorts them by performance.
 * @param {Array} funcs The functions to benchmark
 * @param {number} iterations The amount of iterations to run through and Median on
 * @param {boolean} [nano=true] Whether to show the formatted string in milliseconds or nanoseconds
 * @param {boolean} [log=true] Whether or not to log the results to the console right away
 * @returns {object} The results. All ready to be handled if you don't want them printed to the console.
 */
export const benchmark = (funcs, iterations, nano = true, log = true) => {
  return new Promise(async resolve => {
    const res = [];

    for (let i = 0; i < funcs.length; i++) {
      const funct = funcs[i];

      let obs;
      try {
        const benches = [];

        await new Promise(resolve => {
          const wrapper = performance.timerify(funct);
          obs = new PerformanceObserver((list) => {
            try {
              benches.push(
                BigInt(
                  (
                    list.getEntries()[
                      list.getEntries().length - 1
                    ].duration * 1000000
                  ).toFixed(0)
                )
              );

              if (benches.length === iterations) {
                obs.disconnect();
                resolve();
              }
            } catch {
              obs.disconnect();
            }
          });
          obs.observe({ entryTypes: [ 'function' ] });
          for (let j = 0; j < iterations; j++) {
            wrapper();
          }
        });

        const getMedian = array => {
          const copy = BigInt64Array.from(array).sort();
          return copy[Math.floor(copy.length / 2)];
        };

        const getAverage = array => {
          return BigInt(array.reduce((a, b) => a + b) / BigInt(array.length));
        };

        /*
         * The PerformanceObserver only sees up to 100 nanoseconds of precision.
         * Round to the nearest 100s place to easily ignore rounding errors.
         */
        const median = Math.round(Number(getMedian(benches)) / 100) * 100;
        const average = getAverage(benches);

        res.push({
          Iterations: iterations,
          'Median Time': nano
            ? `${median.toLocaleString()}ns`
            : `${(median / 1000000n).toLocaleString()}ms`,
          'Average Time': nano
            ? `${average.toLocaleString()}ns`
            : `${(average / 1000000n).toLocaleString()}ms`,
          Function: funct.toString(),
          '(Median Time)': median,
          '(Average Time)': average
        });
      } catch (error) {
        try {
          obs.disconnect();
        } catch {}
        res.push({
          'Median Time': null,
          Function: funct.toString(),
          Error: error
        });
        console.error(error);
      }
    }

    res.sort((bench1, bench2) => {
      if (bench1['(Median Time)'] > bench2['(Median Time)']) return 1;
      if (bench1['(Median Time)'] < bench2['(Median Time)']) return -1;
      return 0;
    });

    if (log) {
      console.table(res, [
        'Median Time',
        'Average Time',
        'Function',
        'Error'
      ]);
    }
    resolve(res);
  });
};
