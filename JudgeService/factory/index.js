class Factory {
  static instance = null;
  constructor() {

  }

  receiveJob() {

  }

  distributeWorker() {

  }

  getInstance() {
    if (!Factory.instance) {
      Factory.instance = new Factory();
    }
    return Factory.instance;
  }
}

modules.export = Factory;