class Lang {
    image = null;
    mem = null;
    time = null;
    code = null;
    id = null;
    vm = null;
    inPath = null;
    outPath = null;
    cpuUsage = null;
    memUsage = null;
    exitCode = null;
    output = "";

    constructor(mem, time, code) {
        this.mem = mem;
        this.time = time;
        this.code = code;
    }

    createContainer() {

    }

    startContainer() {

    }

    buildCode() {

    }


    runCode() {

    }

    stopContainer() {

    }
    
    removeContainer(){

    }
    
    updateConfig(mem, time, code) {

    }
}

module.exports = Lang;