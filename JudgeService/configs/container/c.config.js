function containerConfig(name) {
  return {
    Image: "gcc",
    name: name,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    OpenStdin: true,
    AttachStdin: true,
    WorkingDir: "/usr/src/myapp",
    HostConfig: {
      Memory: 500 * 1024 * 1024,
      // NanoCpus: 2000000000,
    },
  };
}

function startConfig(code, inPath) {
  return {
    Cmd: ["sh", "-c", `echo '${code}' > ${inPath}`],
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
  };
}
function buildConfig(inPath, outPath) {
  return {
    Cmd: ["sh", "-c", `gcc -o ${outPath} ${inPath}`],
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
  };
}

function runConfig(outPath) {
  const src = "./" + outPath;
  return {
    Cmd: ["sh", "-c", src],
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
  };
}

module.exports = {
  containerConfig,
  startConfig,
  buildConfig,
  runConfig,
};
