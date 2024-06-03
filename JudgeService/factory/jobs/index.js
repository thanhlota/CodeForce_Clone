class Job {
  lang = null;
  mem = null;
  time = null;
  code = null;
  testcases = null;
  submission_id = null;
  httpResponse = null;
  constructor(lang, mem, time, code, testcases, httpResponse, submission_id) {
    this.lang = lang;
    this.mem = mem;
    this.time = time;
    this.code = code;
    this.testcases = testcases;
    this.httpResponse = httpResponse;
    this.submission_id = submission_id;
  }
}

module.exports = Job;
