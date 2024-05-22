function containerConfig(name) {
    return {
        Image: 'gcc',
        name: name,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        OpenStdin: true,
        AttachStdin: true,
        WorkingDir: "/usr/src/myapp"
    }
}

function startConfig(code, inPath) {
    return {
        Cmd: ['sh', '-c', `echo "${code.replace(/"/g, '\\"')}" > ${inPath}`],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
    }
}
function buildConfig(inPath, outPath) {
    return {
        Cmd: ['g++', inPath, '-o', outPath],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true
    }

}

function runConfig(outPath) {
    const src = "./" + outPath;
    return {
        Cmd: [src],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
    }
}


module.exports = {
    containerConfig,
    startConfig,
    buildConfig,
    runConfig
}