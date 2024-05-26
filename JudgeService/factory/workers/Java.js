const Worker = require("./index.js");
const Container = require("../containers/Java.js");
const WorkerState = require("../../enum/WorkerState");
const CodeError = require("../../enum/CodeError.js");
class Java extends Worker {
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
    const { mem, time, code, input } = job;
    const response = {};
    try {
      if (this.container) {
        this.container.updateConfig(mem, time, code, input);
      } else {
        this.container = new Container(mem, time, code, input);
        await this.container.createContainer();
        await this.container.startContainer();
      }
      await this.container.createFile();
      await this.container.buildCode();
      await this.container.runCode();
      await this.container.stopContainer();
    } catch (e) {
      const { exitCode } = this.container;
      switch (exitCode) {
        case CodeError.COMPILE_ERROR:
          console.log("COMPILE ERROR", e.message);
          break;
        case CodeError.RUN_TIME_ERROR:
          console.log("Run time error", e.message);
          break;
        case CodeError.MEMORY_LIMIT_EXCEED:
          console.log("Memory exceed", e.message);
          break;
        case CodeError.TIME_LIMIT_EXCEED:
          console.log("Time exceed", e.message);
          break;
        default:
          console.log("INTERNAL SERVER ERROR:", e.message);
      }
    }
    response.code = this.container.getExitCode();
    response.data = this.container.getOutput();
    this.notifyFactory(response);
    this.container.clearData();
    if (response.code === CodeError.SERVER_ERROR) {
      await this.handleServerError();
    } else if (
      response.code === CodeError.MEMORY_LIMIT_EXCEED ||
      response.code === CodeError.TIME_LIMIT_EXCEED
    ) {
      await this.handleResourceExceed();
    }
    this.setWorkerAvailable();
  }

  notifyFactory() {
    if (this.container) {
      const { exitCode, output } = this.container;
      const info = { exitCode, output };
      console.log("info", info);
    }
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

module.exports = Java;
