class Job {
  lang = null;
  mem = null;
  time = null;
  code = null;
  testcases = null;
  httpResponse = null;
  constructor(lang, mem, time, code, testcases, httpResponse) {
    this.lang = lang;
    this.mem = mem;
    this.time = time;
    this.code = code;
    this.testcases = testcases;
    this.httpResponse = httpResponse;
  }
}

module.exports = Job;
