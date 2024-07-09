class Job {
  lang = null;
  mem = null;
  time = null;
  code = null;
  testcases = null;
  submission_id = null;
  worker_response = null;
  ranking_response = null;
  constructor(lang, mem, time, code, testcases, worker_response, ranking_response, submission_id) {
    this.lang = lang;
    this.mem = mem;
    this.time = time;
    this.code = code;
    this.testcases = testcases;
    this.submission_id = submission_id;
    this.worker_response = worker_response;
    this.ranking_response = ranking_response;
  }
}

module.exports = Job;
