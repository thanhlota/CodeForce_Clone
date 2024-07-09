const Worker = require("./index.js");
const Container = require("../containers/C++.js");
const WorkerState = require("../../enum/WorkerState");
const CodeError = require("../../enum/CodeError.js");
const Verdict = require("../../enum/Verdict.js");

class Cplusplus extends Worker {
  constructor() {
    super();
  }

  setWorkerBusy() {
    this.state = WorkerState.BUSY;
  }

  setWorkerAvailable() {
    this.state = WorkerState.AVAILABLE;
  }

  setContainer(container) {
    this.container = container;
  }
  async processJob(job) {
    const { mem, time, code, testcases, worker_response,ranking_response, submission_id } = job;
    const response = [];
    let data = {};
    try {
      for (let i = 0; i < testcases.length; i++) {
        data = {
          exitCode: null, output: "", verdict: "", submission_id, time: "", memory: "",
          testcase_id: testcases[i].id,
          name: `Test_case_${i + 1}`,
          expected_output: testcases[i].expected_output,
          input: testcases[i].input
        };
        const endCharacter = "\x04";
        const input = testcases[i].input + endCharacter;
        if (this.container) {
          this.container.updateConfig(mem, time, code, input);
        } else {
          this.container = new Container(mem, time, code, input);
          await this.container.createContainer();
          await this.container.startContainer();
        }
        if (i == 0) {
          await this.container.createFile();
          await this.container.buildCode();
        }
        await this.container.runCode();
        const output = this.container.getOutput();
        data = { ...data, output: output?.result, memory: output.memUsage, time: output.cpuUsage };
        if (output?.result === testcases[i].expected_output) {
          data.verdict = Verdict.AC;
        }
        else {
          data.verdict = Verdict.WA;
        }
        response.push(data);
        if (data.verdict == Verdict.WA) {
          console.log("WRONG ANSWER");
          break;
        }
      }
      // await this.container.stopContainer();
    } catch (e) {
      const { exitCode } = this.container;
      data.exitCode = exitCode;
      data.output = e.message;
      switch (exitCode) {
        case CodeError.WRONG_ANSWER:
          console.log("WRONG ANSWER", e.message);
          data.verdict = Verdict.WA;
          break;
        case CodeError.COMPILE_ERROR:
          console.log("COMPILE ERROR", e.message);
          data.verdict = Verdict.CE;
          break;
        case CodeError.RUN_TIME_ERROR:
          console.log("Run time error", e.message);
          data.verdict = Verdict.RE;
          break;
        case CodeError.MEMORY_LIMIT_EXCEED:
          console.log("Memory exceed", e.message);
          data.verdict = Verdict.MLE;
          break;
        case CodeError.TIME_LIMIT_EXCEED:
          console.log("Time exceed", e.message);
          data.verdict = Verdict.TLE;
          break;
        default:
          console.log("INTERNAL SERVER ERROR:", e.message);
          data.verdict = Verdict.SE;
      }
      response.push(data);
    }
    if (this.container) this.container.clearData();
    if (data.exitCode === CodeError.SERVER_ERROR) {
      await this.handleServerError();
    } else if (
      data.exitCode === CodeError.MEMORY_LIMIT_EXCEED ||
      data.exitCode === CodeError.TIME_LIMIT_EXCEED
    ) {
      await this.handleResourceExceed();
    }
    this.setWorkerAvailable();
    worker_response(response);
    ranking_response(data.verdict);
  }



  async handleServerError() {
    try {
      await this.container.removeContainer();
      this.container = null;
    } catch (e) {
      console.log("CRICTICAL ERROR:", e);
    }
  }

  async handleResourceExceed() {
    try {
      await this.container.vm.restart();
      console.log("Restart successfully after exceed");
    } catch (e) {
      console.log(e);
      await this.handleServerError();
    }
  }
}

module.exports = Cplusplus;
