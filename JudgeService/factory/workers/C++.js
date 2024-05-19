const Worker = require('./index.js');
const Container = require('../containers/C++.js');
class Cplusplus extends Worker {
    constructor() {

    }

    processJob(job) {
        const { mem, time, code } = job;
        const container = new Container(mem, time, code);
        container.start();
        
    }
}

module.exports = Cplusplus;