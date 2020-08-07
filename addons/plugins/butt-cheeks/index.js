const { Plugin } = require('@entities');

class ButtCheeks extends Plugin {
  onStart () {
    console.log('hi');
  }
}

module.exports = ButtCheeks;
