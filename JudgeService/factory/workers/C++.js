const Worker = require('./index.js');
const Container = require('../containers/C++.js');
const WorkerState = require('../../enum/WorkerState');
class Cplusplus extends Worker {
    constructor() {
        super();
    }

    setWorkerBusy() {
        this.state = WorkerState.BUSY;
    }

    setWorkerAvailable() {
        this.state = WorkerState.AVAILABLE;
    }

    async processJob(job) {
        this.setWorkerBusy();
        const { mem, time, code } = job;
        if (this.container) {
            this.container.updateSourceCode(code);
        }
        else {
            this.container = new Container(mem, time, code);
        }
        try {
            await this.container.createContainer();
            await this.container.startContainer();
            await this.container.createFile();
            // await this.container.buildCode();
            // await this.container.runCode();
            await this.container.stopContainer();
        }
        catch (e) {
            console.log('ERROR:', e);
        }
        this.setWorkerAvailable();
    }

}

module.exports = Cplusplus;