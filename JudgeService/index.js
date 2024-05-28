// const express = require("express");
const Factory = require("./factory");
const readFile = require("./utils/readFile");

const mem = 256 * 1024 * 1024;
const time = 1000 * 1000000;
const lang = "C";
const Job = require("./factory/jobs");
const filePath = "../test.c";
const fileContent = readFile(filePath);
const input = "20\n\x04";
const newJob = new Job(lang, mem, time, fileContent, input);
const FactoryInstance = Factory.getInstance();
FactoryInstance.distributeWorker(newJob);
