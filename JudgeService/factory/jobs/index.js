class Job {
    language = null;
    mem = null;
    time = null;
    code = null;
    constructor(language, mem, time, code) {
        this.language = language;
        this.mem = mem;
        this.time = time;
        this.code = code;
    }
}

module.exports = Job;