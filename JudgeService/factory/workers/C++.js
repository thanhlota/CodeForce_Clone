const Worker = require('./index.js');
const Container = require('../containers/C++.js');
const WorkerState = require('../../enum/WorkerState');
const CodeError = require('../../enum/CodeError.js');
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
            await this.container.stopContainer();
            this.notifyFactory(true);
        }
        finally {

        }
        this.setWorkerAvailable();
    }

    notifyFactory(serverError) {
        if (serverError) {

        }
        else {

        }
        const data = {};
        if (this.container.isBuildError) {
            data.buildError = true;
            return data;
        }

    }

}

module.exports = Cplusplus;