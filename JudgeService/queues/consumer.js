
require('dotenv').config();
const amqp = require('amqplib');
const QUEUE = 'jobs';
const Job = require("../factory/jobs");
const Factory = require("../factory");
const Publisher = require("./publisher");
class Consumer {
    static instance = null;
    channel = null;
    queue = null;

    setQueue(queue) {
        this.queue = queue;
    }

    setChannel(channel) {
        this.channel = channel;
    }

    async init() {
        try {
            const connection = await amqp.connect(process.env.AMQP_URI);

            const judgeChannel = await connection.createChannel();
            this.setChannel(judgeChannel);

            const queue = await judgeChannel.assertQueue(QUEUE, { duration: true });
            this.setQueue(queue);

            judgeChannel.prefetch(16);
            console.log(' [x] Awaiting RPC requests');
        }
        catch (e) {
            console.log("Error when init consumer", e.message);
        }
    }

    async receiveJob() {
        try {
            this.channel.consume(QUEUE, (msg) => {
                const jobString = msg.content.toString();
                const jobObject = JSON.parse(jobString);
                const worker_reponse = (data) => {
                    this.channel.sendToQueue(msg.properties.replyTo,
                        Buffer.from(JSON.stringify(data))
                    )
                    this.channel.ack(msg);
                };
                const {
                    contest_id,
                    problem_id,
                    user_id,
                    user_name,
                    lang,
                    mem,
                    time,
                    code,
                    testcases,
                    submission_id,
                    ongoingContest
                } = jobObject;
                const ranking_response = (verdict) => {
                    if (ongoingContest) {
                        const job = {
                            contest_id,
                            problem_id,
                            user_id,
                            user_name,
                            verdict
                        }
                        Publisher.getInstance().pushJob(job);
                    }
                };

                const newJob = new Job(
                    lang,
                    mem,
                    time,
                    code,
                    testcases,
                    worker_reponse,
                    ranking_response,
                    submission_id
                );

                const FactoryInstance = Factory.getInstance();
                const worker = FactoryInstance.distributeWorker(newJob);
                if (!worker) {
                    this.channel.nack(msg, false, true);
                }
                else if (worker.languageError) {
                    this.channel.nack(msg, false, false);
                }
            }, { noAck: false })
        }
        catch (e) {
            console.log("Error when receive job", e.message);
            this.channel.nack(msg, false, true);
        }
    }

    static getInstance() {
        if (!Consumer.instance) {
            Consumer.instance = new Consumer();
        }
        return Consumer.instance;
    }
}

module.exports = Consumer;