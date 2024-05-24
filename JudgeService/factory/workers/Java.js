const Worker = require('./index.js');
const Container = require('../containers/Java.js');
const WorkerState = require('../../enum/WorkerState');
class Cplusplus extends Worker {

    constructor() {
        this.state = WorkerState.AVAILABLE;
        this.container = null;
    }

    processJob(job) {
        const { mem, time, code } = job;
        this.container = new Container(mem, time, code);
        this.container.start();
    }

}

module.exports = Cplusplus;