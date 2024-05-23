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
    this.outPath = 'main.exe'

  }

  setContainerId(id) {
    this.id = id;
  }

  setVm(vm) {
    this.vm = vm;
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
      console.log('Error when create new cpp container');
      throw e;
    }
  }

  async startContainer() {
    try {
      await this.vm.start();
      console.log('Create cpp container successfully!')
    }
    catch (e) {
      console.log('Error when start cpp container');
      throw e;
    }
  }

  async createFile() {
    try {
      const createFileExec = await this.vm.exec(startConfig(this.code, this.inPath));
      await createFileExec.start({
        stdin: true
      }, (err, stream) => {
        if (err) {
          console.log('Error when create file!');
          throw (err);
        }
        stream.on('end', () => {
          console.log('Create file finished!');
        });
      });
    }
    catch (e) {
      console.log('Error when create new file');
      throw (e);
    }
  }

  async buildCode() {
    return new Promise(async (resolve, reject) => {
      try {
        const buildExec = await this.vm.exec(buildConfig(this.inPath, this.outPath));
        await buildExec.start({
          stdin: true
        }, (err, stream) => {
          if (err) {
            console.log('Error when build code!');
            throw (err);
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
              reject({ name: CodeError.COMPILE_ERROR, message: error });
            }
            else {
              console.log('Compile successfully!');
              resolve(true);
            }
          });
        });
      }
      catch (e) {
        console.log('Error when build cpp code');
        throw e;
      }
    })

  }

  async runCode() {
    return new Promise(async (resolve, reject) => {
      try {
        // await this.vm.restart();
        const runExec = await this.vm.exec(runConfig(this.outPath));
        await runExec.start({
          stdin: true
        }, (err, stream) => {
          if (err) {
            console.log('Error when run code!');
            throw (err);
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
          stream.on('end', () => {
            if (error) {
              reject({ name: CodeError.RUN_TIME_ERROR, message: error });
            }
            else {
              console.log("Result:", output);
              resolve(true);
            }
          });
        });

      }
      catch (e) {
        console.log('Error when run cpp code');
        throw e;
      }
    })

  }

  async stopContainer() {
    try {
      await this.vm.stop();
      console.log(`Container ${this.vm.id} stopped successfully!`);
    }
    catch (e) {
      console.log('Error when stop cpp code');
      throw e;
    }
  }

  async updateSourceCode(code) {
    this.code = code;
  }

}

module.exports = CPlusPlus;