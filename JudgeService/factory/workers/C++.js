const Worker = require('./index.js');
const Container = require('../containers/C++.js');
const WorkerState = require('../../enum/WorkerState');
const CodeError = require('../../enum/CodeError.js');
const SeverError = require("../../enum/ServerError.js")
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
            await this.container.buildCode();
            await this.container.runCode();
            await this.container.stopContainer();
        }
        catch (e) {
            if (e.name === CodeError.COMPILE_ERROR) {
                console.log('Error when compile code', e.message);
            }
            else if (e.name === CodeError.RUN_TIME_ERROR) {
                console.log('Error when run code', e.message);
            }
            else if (e.name === CodeError.TIME_LIMIT_EXCEED) {
                console.log('Time limit exceed', e.message);
            }
            else if (e.name === CodeError.MEMORY_LIMIT_EXCEED) {
                console.log('Memory limit exceed', e.message);
            }
            await this.container.stopContainer();
        }
        this.setWorkerAvailable();
    }

}

module.exports = Cplusplus;