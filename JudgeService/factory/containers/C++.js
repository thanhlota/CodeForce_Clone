const Lang = require('./index.js');
const Docker = require('dockerode');
const { containerConfig, compileConfig, startConfig, runConfig, buildConfig } = require('../../configs/container/cpp.config.js');

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
      const createFileStream = await createFileExec.start({
        stdin: true
      });
      createFileStream.pipe(process.stdout);
      await new Promise((resolve, reject) => {
        createFileStream.on('end', resolve());
        createFileStream.on('error', reject(error));
      })
        .then(() => console.log("Create file finished!"))
        .catch((error) => console.log("Error when create file:", error));
    }
    catch (e) {
      console.log('Error when create new file');
      throw (e);
    }
  }

  async buildCode() {
    try {
      const buildExec = await this.vm.exec(buildConfig(this.inPath, this.outPath));
      const buildStream = await buildExec.start({
        hijack: true, stdin: true
      });
      this.vm.modem.demuxStream(buildStream, process.stdout, process.stderr);
      await new Promise((resolve, reject) => {
        buildStream.on('end', resolve());
        buildStream.on('error', reject(error));
      })
        .then(() => console.log("Build finished!"))
        .catch((error) => {
          throw error;
        })
    }
    catch (e) {
      console.log('Error when build cpp code');
      throw e;
    }
  }

  async runCode() {
    try {
      await this.vm.restart();
      const runExec = await this.vm.exec(runConfig(this.outPath));
      const runStream = await runExec.start({
        hijack: true, stdin: true
      });
      this.vm.modem.demuxStream(runStream, process.stdout, process.stderr);
      await new Promise((resolve, reject) => {
        runStream.on('end', resolve());
        runStream.on('error', reject(error));
      })
        .then(() => console.log("Run finished!"))
        .catch((error) => console.log("Run failed!", error));
    }
    catch (e) {
      console.log('Error when run cpp code');
      throw e;
    }
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