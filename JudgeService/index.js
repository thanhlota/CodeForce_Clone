const Factory = require("./factory");
const Job = require("./factory/jobs");
// const readFile = require("./utils/readFile");

const mem = 256 * 1024 * 1024;
const time = 1000 * 1000000;
const FactoryInstance = Factory.getInstance();
require('dotenv').config();
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.HOST_PORT || 6000;

app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});

app.listen(port, () => console.log(`listening on port ${port}`));

app.post('/api/process-job', (req, res) => {
    const {
        submission_id,
        code,
        lang,
        testcases
    } = req.body;
    const httpResponse = (data) => {
        return res.status(200).send({
            data,
        })
    }
    const newJob = new Job(lang, mem, time, code, testcases, httpResponse, submission_id);
    FactoryInstance.distributeWorker(newJob);
});
