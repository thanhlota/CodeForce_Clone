class Job {
    lang = null;
    mem = null;
    time = null;
    code = null;
    constructor(lang, mem, time, code) {
        this.lang = lang;
        this.mem = mem;
        this.time = time;
        this.code = code;
    }
}

module.exports = Job;