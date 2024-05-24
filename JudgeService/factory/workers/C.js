const Worker = require('./index.js');
const Container = require('../containers/C.js');
const WorkerState = require('../../enum/WorkerState');
class C extends Worker {
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

module.exports = C; 