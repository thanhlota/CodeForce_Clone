class Job {
    lang = null;
    mem = null;
    time = null;
    code = null;
    input = null;
    constructor(lang, mem, time, code, input) {
        this.lang = lang;
        this.mem = mem;
        this.time = time;
        this.code = code;
        this.input = input;
    }
}

module.exports = Job;