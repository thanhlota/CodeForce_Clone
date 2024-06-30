require('dotenv').config();
const Factory = require("./factory");
const Job = require("./factory/jobs");
const express = require("express");
const mem = 256 * 1024 * 1024;
const time = 1000 * 1000000;
const FactoryInstance = Factory.getInstance();

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
    const worker_response = (data) => {
        return res.status(200).send({
            data,
        })
    }
    const newJob = new Job(lang, mem, time, code, testcases, worker_response, submission_id);
    FactoryInstance.distributeWorker(newJob);
});
const Publisher = require("./queues/publisher");
(async (
) => {
    const publisher = Publisher.getInstance();
    await publisher.init();
})();


app.post('/api/rank', (req, res) => {
    const publisher = Publisher.getInstance();
    publisher.pushJob({
        Test: true
    })
    res.status(200).send({ message: "OK" })
})

const Consumer = require("./queues/consumer");
(async (
) => {
    const consumer = Consumer.getInstance();
    await consumer.init();
    consumer.receiveJob();
})();

