/* eslint no-async-promise-executor: 0 */

const Lang = require('./index.js');
const Docker = require('dockerode');
const Stream = require('stream')
const { containerConfig, startConfig, runConfig, buildConfig } = require('../../configs/container/c.config.js');
const CodeError = require('../../enum/CodeError.js');

class CPlusPlus extends Lang {
  constructor(mem, time, code, input) {
    super(mem, time, code, input);
    this.id = Date.now().toString(36);
    this.vm = null;
    this.inPath = 'main.c';
    this.outPath = 'main.exe';
    this.exitCode = null;
    this.cpuUsage = 0;//nanosecond
    this.memUsage = 0;
    this.output = {};
    this.infoStream = null;
    this.runStream = null;
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
    this.output = output;
  }

  setInfoStream(infoStream) {
    this.infoStream = infoStream;
  }

  setRunStream(runStream) {
    this.runStream = runStream;
  }

  getOutput() {
    return this.output;
  }
  getExitCode() {
    return this.exitCode;
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
      /*
      STATS EXEC
      */
      try {
        const statsStream = await this.vm.stats({ stream: true });
        this.setInfoStream(statsStream);
        statsStream.on('data', (data) => {
          const stats = JSON.parse(data.toString());
          const cpuUsage = (stats.cpu_stats.cpu_usage.total_usage - this.cpuUsage);
          const memUsage = stats.memory_stats.max_usage - this.memUsage;
          if (cpuUsage > this.time) {
            this.setExitCode(CodeError.TIME_LIMIT_EXCEED);
            reject({ message: CodeError.TIME_LIMIT_EXCEED });
          }
          if (memUsage > this.mem) {
            this.setExitCode(CodeError.MEMORY_LIMIT_EXCEED);
            reject({ message: CodeError.MEMORY_LIMIT_EXCEED });
          }
        });
      } catch (e) {
        this.setExitCode(CodeError.SERVER_ERROR);
        reject(e);
      }
      /*
      RUN EXEC
      */
      try {
        const runExec = await this.vm.exec(runConfig(this.outPath));
        runExec.start({
          stdin: true
        }, async (err, stream) => {
          this.setRunStream(stream);
          if (err) {
            this.setExitCode(CodeError.SERVER_ERROR);
            reject(err);
          }
          stream.write(this.input);
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
              this.setExitCode(CodeError.RUN_TIME_ERROR);
              reject({ message });
            }
            else {
              const stats = await this.vm.stats({ stream: false });
              const cpuUsage = (stats.cpu_stats.cpu_usage.total_usage - this.cpuUsage);
              const memUsage = stats.memory_stats.max_usage - this.memUsage;
              if (cpuUsage > this.time) {
                this.setExitCode(CodeError.TIME_LIMIT_EXCEED);
                reject({ message: CodeError.TIME_LIMIT_EXCEED });
              }
              if (memUsage > this.mem) {
                this.setExitCode(CodeError.MEMORY_LIMIT_EXCEED);
                reject({ message: CodeError.MEMORY_LIMIT_EXCEED });
              }
              const data = {
                result: output,
                cpuUsage,
                memUsage
              }
              this.setOutput(data);
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
      const containerName = `cpp_container_${this.id}`;
      console.log(`Container ${containerName} stopped successfully!`);
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
      const containerName = `cpp_container_${this.id}`;
      console.log(`Container ${containerName} removed successfully!`);
    }
    catch (e) {
      this.setExitCode(CodeError.SERVER_ERROR);
      throw e;
    }
  }

  async updateConfig(mem, time, code, input) {
    this.code = code;
    this.mem = mem;
    this.time = time;
    this.input = input;
  }

  clearData() {
    this.exitCode = null;
    this.cpuUsage = 0;
    this.memUsage = 0;
    this.output = {};
    if (this.infoStream) this.infoStream.destroy();
    this.infoStream = null;
    if (this.runStream) this.runStream.destroy();
    this.runStream = null;
    this.input = null;

  }

}

module.exports = CPlusPlus;