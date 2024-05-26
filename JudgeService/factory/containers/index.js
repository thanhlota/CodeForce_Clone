class Lang {
  image = null;
  mem = null;
  time = null;
  code = null;
  input = null;
  id = null;
  vm = null;
  inPath = null;
  outPath = null;
  cpuUsage = null;
  memUsage = null;
  exitCode = null;
  output = {};

  constructor(mem, time, code, input) {
    this.mem = mem;
    this.time = time;
    this.code = code;
    this.input = input;
  }

  createContainer() {}

  startContainer() {}

  buildCode() {}

  runCode() {}

  stopContainer() {}

  removeContainer() {}

  updateConfig() {}
}

module.exports = Lang;
