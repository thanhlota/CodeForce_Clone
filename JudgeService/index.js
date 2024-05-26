// const express = require("express");
const Factory = require("./factory");
const readFile = require("./utils/readFile")
// const app = express();

// app.get("/", (req, res) => {
//   res.send("<h2>Hello world hihi</h2>");
// });

// console.log("env", process.env.HOST_PORT);
// const port = process.env.HOST_PORT || 7000;

// app.listen(port, () => console.log(`listening on port ${port}`));

const mem = 256 * 1024 * 1024;
const time = 1000 * 1000000;
const lang = "JAVA";
const Job = require('./factory/jobs');
const filePath = '../test.java';
const fileContent = readFile(filePath);
const input = "5332 2000031\n\x04";
const newJob = new Job(lang, mem, time, fileContent, input);
const FactoryInstance = Factory.getInstance();
FactoryInstance.distributeWorker(newJob);