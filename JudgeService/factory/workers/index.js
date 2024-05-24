const WorkerState = require('../../enum/WorkerState');
class Worker {
    state = null;
    container = null;
    httpResponse = null;
    contructor() {
        this.state = WorkerState.AVAILABLE;
        this.container = null;
        this.httpResponse = null;
    }

    processJob() {

    }

   
}

module.exports = Worker;
