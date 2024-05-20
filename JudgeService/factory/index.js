const CWorker = require('./workers/C.js');
const CPlusPlusWorker = require('./workers/C++.js');
const JavaWorker = require('./workers/Java.js');
const WorkerState = require('../enum/WorkerState.js');
const Language = require('../enum/Language.js');
const WorkerConfig = require('../configs/worker.config.js');

class Factory {
  static instance = null;
  static workers = [];

  constructor() {
  }

  distributeWorker(job) {
    let worker = this.checkAvailableWorker(job);
    if (worker) {
      worker.processJob(job);
      return;
    }
    if (this.checkCanHireMoreWoker(job)) {
      switch (job.lang) {
        case Language.C:
          worker = new CWorker(job);
          break;
        case Language.CPlusPlus:
          worker = new CPlusPlusWorker(job);
          break;
        case Language.JAVA:
          worker = new JavaWorker(job);
          break;
        default:
          console.log('Language is not supported');
      }
      if (worker) {
        workers.push(worker);
        worker.processJob(job);
      }
    }
  }

  checkAvailableWorker(job) {
    const { lang } = job;
    for (let i = 0; i < workers.length; i++) {
      const currentWorker = workers[i];
      if (currentWorker.state == WorkerState.AVAILABLE) {
        if (
          (lang === Language.C && currentWorker.instanceof(CWorker))
          || (Language.CPlusPlus && currentWorker.instanceOf(CPlusPlusWorker))
          || (lang === Language.JAVA && currentWorker.instanceOf(JavaWorker))) {
          return currentWorker;
        }
      }
    }
    return null;
  }

  checkCanHireMoreWoker(job) {
    const { lang } = job;
    let countC = 0, countCpp = 0, countJava = 0;
    for (let i = 0; i < workers.length; i++) {
      const currentWorker = workers[i];
      if (currentWorker instanceof CWorker) {
        countC++;
      } else if (item instanceof JavaWorker) {
        countJava++;
      } else if (item instanceof CPlusPlusWorker) {
        countCpp++;
      }
    }
    if (lang === Language.C) {
      return countC < WorkerConfig.MAX_C_WORKER;
    }
    else if (lang === Language.CPlusPlus) {
      return countCpp < WorkerConfig.MAX_CPLUSPLUS_WORKER;
    }
    else if (lang === Language.JAVA) {
      return countJava < WorkerConfig.MAX_JAVA_WORKER;
    }
    return true;
  }

  async removeAllWorkers() {
    for (let i = 0; i < workers.length; i++) {
      const currentWorker = workers[i];
      if (currentWorker.container) {
        try {
          await currentWorker.container.stop();
          console.log(`${currentWorker.container.id} stopped successfully!`);
          await currentWorker.container.remove();
          console.log(`${currentWorker.container} removed successfully!`);
        }
        catch (e) {
          console.log(`Error when remove worker id: ${id}`, e);
        }
      }
    }
  }

  static getInstance() {
    if (!Factory.instance) {
      Factory.instance = new Factory();
    }
    return Factory.instance;
  }
}

module.exports = Factory;