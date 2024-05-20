const WorkerState = require('../../enum/WorkerState');
class Worker {
    state = WorkerState.AVAILABLE;
    container = null;
    contructor() {
    }

    processJob() {

    }
}

module.exports = Worker;
