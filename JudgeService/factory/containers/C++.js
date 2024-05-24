/* eslint no-async-promise-executor: 0 */

const Lang = require('./index.js');
const Docker = require('dockerode');
const Stream = require('stream')
const { containerConfig, startConfig, runConfig, buildConfig } = require('../../configs/container/cpp.config.js');
const CodeError = require('../../enum/CodeError.js');

class CPlusPlus extends Lang {
  constructor(mem, time, code) {
    super(mem, time, code);
    this.id = Date.now().toString(36);
    this.vm = null;
    this.inPath = 'main.cpp';
    this.outPath = 'main.exe';
    this.exitCode = null;
    this.cpuUsage = 0;//nanosecond
    this.memUsage = 0;
    this.outPut = 0;
  }

  setContainerId(id) {
    this.id = id;
  }

  setVm(vm) {
    this.vm = vm;
  }

  setCpuUsage(usage) {
    this.cpuUsage = usage;
  }

  setMemUsage(usage) {
    this.memUsage = usage;
  }

  setExitCode(exitCode) {
    this.exitCode = exitCode;
  }

  setOutput(output) {
    this.outPut = output;
  }

  async createContainer() {
    const docker = new Docker();
    const containerName = `cpp_container_${this.id}`;
    try {
      const vm = await docker.createContainer(containerConfig(containerName));
      this.setVm(vm);
      console.log(`Container id:${containerName} is created successfully!`);
    }
    catch (e) {
      this.setExitCode(CodeError.SERVER_ERROR);
      throw e;
    }
  }

  async startContainer() {
    try {
      await this.vm.start();
      console.log('Start cpp container successfully!');
    }
    catch (e) {
      this.setExitCode(CodeError.SERVER_ERROR);
      throw e;
    }
  }

  async createFile() {
    return new Promise(async (resolve, reject) => {
      try {
        const createFileExec = await this.vm.exec(startConfig(this.code, this.inPath));
        await createFileExec.start({
          stdin: true
        }, (err, stream) => {
          if (err) {
            this.setExitCode(CodeError.SERVER_ERROR);
            reject(err);
          }
          const _outStream = new Stream.PassThrough();
          const _errStream = new Stream.PassThrough();
          let error = "";
          this.vm.modem.demuxStream(stream, _outStream, _errStream);
          _errStream.on('data', (chunk) => {
            error += chunk.toString();
          });
          stream.on('end', () => {
            if (error) {
              this.setExitCode(CodeError.SERVER_ERROR);
              reject({ message: error });
            }
            else {
              console.log('Create file finished!');
              resolve();
            }
          });
        });
      }
      catch (e) {
        console.log('Error when create new file', e);
        this.setExitCode(CodeError.SERVER_ERROR);
        reject(e);
      }
    });

  }

  async buildCode() {
    return new Promise(async (resolve, reject) => {
      try {
        const buildExec = await this.vm.exec(buildConfig(this.inPath, this.outPath));
        await buildExec.start({
          stdin: true
        }, (err, stream) => {
          if (err) {
            this.setExitCode(CodeError.SERVER_ERROR);
            throw (err);
          }
          const _outStream = new Stream.PassThrough();
          const _errStream = new Stream.PassThrough();
          let error = "";
          this.vm.modem.demuxStream(stream, _outStream, _errStream);
          _errStream.on('data', (chunk) => {
            error += chunk.toString();
          });
          stream.on('end', async () => {
            if (error) {
              this.setExitCode(CodeError.COMPILE_ERROR);
              reject({ message: error });
            }
            else {
              const stats = await this.vm.stats({ stream: false });
              this.setCpuUsage(stats.cpu_stats.cpu_usage.total_usage);
              this.setMemUsage(stats.memory_stats.usage);
              console.log('Compile successfully!');
              resolve(true);
            }
          });
        });
      }
      catch (e) {
        this.setExitCode(CodeError.SERVER_ERROR);
        reject(e);
      }
    })

  }

  async runCode() {
    return new Promise(async (resolve, reject) => {
      try {
        const runExec = await this.vm.exec(runConfig(this.outPath));
        runExec.start({
          stdin: true
        }, async (err, stream) => {
          if (err) {
            this.setExitCode(CodeError.SERVER_ERROR);
            reject(err);
          }

          const _outStream = new Stream.PassThrough();
          const _errStream = new Stream.PassThrough();
          let error = "";
          let output = "";
          this.vm.modem.demuxStream(stream, _outStream, _errStream);
          _errStream.on('data', (chunk) => {
            error += chunk.toString();
          });
          _outStream.on('data', (chunk) => {
            output += chunk.toString();
          })
          stream.on('end', async () => {
            if (error) {
              this.setExitCode();
              reject({ name: CodeError.RUN_TIME_ERROR, message: error });
            }
            else {
              const stats = await this.vm.stats({ stream: false });
              this.setCpuUsage(stats.cpu_stats.cpu_usage.total_usage - this.cpuUsage);
              this.setMemUsage(stats.memory_stats.max_usage - this.memUsage);
              this.setOutput(output);
              resolve(true);
            }
          });
        });

      }
      catch (e) {
        this.setExitCode(CodeError.SERVER_ERROR);
        reject(e);
      }
    })

  }

  async stopContainer() {
    try {
      await this.vm.stop();
      console.log(`Container ${this.vm.id} stopped successfully!`);
    }
    catch (e) {
      this.setExitCode(CodeError.SERVER_ERROR);
      throw e;
    }
  }

  async removeContainer() {
    try {
      await this.vm.remove({ force: true });
      this.setVm(null);
      console.log(`Container ${this.vm.id} removed successfully!`);
    }
    catch (e) {
      this.setExitCode(CodeError.SERVER_ERROR);
      throw e;
    }
  }

  async updateConfig(mem, time, code) {
    this.code = code;
    this.mem = mem;
    this.time = time;
  }

}

module.exports = CPlusPlus;