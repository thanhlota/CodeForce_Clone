
require('dotenv').config();
const amqp = require('amqplib');
const QUEUE = 'jobs';
const Job = require("../factory/jobs");
const Factory = require("../factory");
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

            judgeChannel.prefetch(6);
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
                const { lang, mem, time, code, testcases, submission_id } = jobObject;
                const newJob = new Job(lang, mem, time, code, testcases, worker_reponse, submission_id);
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