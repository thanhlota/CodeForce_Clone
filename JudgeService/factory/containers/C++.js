const Lang = require('index.js');
const Docker = require('dockernode');
class CPlusPlus extends Lang {
  constructor(mem, time, code) {
    this.mem = mem;
    this.time = time;
    this.code = code;
  }

  build() {
      
  }

  start() {

  }

  stop() {

  }

}

module.exports = CPlusPlus;