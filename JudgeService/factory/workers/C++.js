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
        this.mem = null;
        this.time = null;
    }

    setContainer(container) {
        this.container = container;
    }
    async processJob(job) {
        const { mem, time, code } = job;
        if (this.container) {
            this.container.updateConfig(mem, time, code);
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
            const { exitCode } = this.container;
            switch (exitCode) {
                case CodeError.SERVER_ERROR:
                    console.log("INTERNAL SERVER ERROR:", e.message);
                    break;
                case CodeError.COMPILE_ERROR:
                    console.log("COMPILE ERROR", e.message);
                    break;
                case CodeError.RUN_TIME_ERROR:
                    console.log("Run time error", e.message);
                    break;
                case CodeError.MEMORY_LIMIT_EXCEED:
                    console.log("Memory exceed", e.message);
                    break;
                case CodeError.TIME_LIMIT_EXCEED:
                    console.log("Time exceed", e.message);
                    break;
                default:
                    console.log("INTERNAL SERVER ERROR:", e.message);
                    await this.container.removeContainer();
                    this.setContainer(null);

            }
        }
        this.setWorkerAvailable();
    }

    notifyFactory() {
        const { exitCode } = this.container;
        switch (exitCode) {
            case CodeError.SERVER_ERROR:
                console.log("INTERNAL SERVER ERROR:", e.message);
                break;
            case CodeError.COMPILE_ERROR:
                console.log("COMPILE ERROR");
                break;
            case CodeError.RUN_TIME_ERROR:
                console.log("Run time error");
                break;
            case CodeError.MEMORY_LIMIT_EXCEED:
                console.log("Memory exceed");
                break;
            case CodeError.TIME_LIMIT_EXCEED:
                console.log("Time exceed");
                break;
            default:
                console.log("INTERNAL SERVER ERROR:", e.message);
        }
    }

}

module.exports = Cplusplus;