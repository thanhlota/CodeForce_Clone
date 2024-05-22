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
const time = 1000;
const lang = "C++";
const Job = require('./factory/jobs');
const filePath = '../test.c++';
const fileContent = readFile(filePath);
const newJob = new Job(lang, mem, time, fileContent);
const FactoryInstance = Factory.getInstance();
FactoryInstance.distributeWorker(newJob);