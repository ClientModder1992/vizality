/* eslint-disable no-unused-vars */

const sleep = module.exports = async time => {
  return new Promise(resolve =>
    setTimeout(resolve, time)
  );
};
