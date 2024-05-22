const WorkerState = require('../../enum/WorkerState');
class Worker {
    state = null;
    container = null;
    contructor() {
        this.state = WorkerState.AVAILABLE;
        this.container = null;
    }

    processJob() {

    }
}

module.exports = Worker;
