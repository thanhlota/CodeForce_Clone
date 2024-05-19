const CWorker = require('./workers/C.js');
const CPlusPlusWorker = require('./workers/C++.js');
const JavaWorker = require('./workers/Java.js');
class Factory {
  static instance = null;
  static workers = [];

  constructor() {
  }

  distributeWorker(job) {
    let worker = this.checkAvailableWorker(job);
    if (worker) {

    }
    else {
      switch (job.lang) {
        case 'C':
          worker = new CWorker(job);
          break;
        case 'C++':
          worker = new CPlusPlusWorker(job);
          break;
        case 'Java':
          worker = new JavaWorker(job);
          break;
        default:
          console.log('Language is not supported');
      }
      workers.push(worker);
      worker.processJob(job);
    }
  }

  checkAvailableWorker(job) {
    return null;
  }

  removeAllWorkers() {

  }


  static getInstance() {
    if (!Factory.instance) {
      Factory.instance = new Factory();
    }
    return Factory.instance;
  }
}

module.exports = Factory;