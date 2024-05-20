const Lang = require('./index.js');
const Docker = require('dockerode');

class CPlusPlus extends Lang {
  constructor(mem, time, code) {
    this.mem = mem;
    this.time = time;
    this.code = code;
    this.image = ''
  }

  createContainer() {
    try {
      const docker = new Docker();
      const newContainer =  docker.createContainer({

      });
    }
    catch (e) {

    }
  }

  startContainer() {


  }

  buildCode() {

  }

  runCode() {

  }

  stopContainer() {

  }

}

module.exports = CPlusPlus;