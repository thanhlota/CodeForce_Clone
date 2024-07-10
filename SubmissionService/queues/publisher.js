
require('dotenv').config();
const amqp = require('amqplib');
const EXCHANGE = "direct_jobs";
const QUEUE = 'jobs';
const ROUTING_KEY = 'task_queue';
const RESPONSE_QUEUE = 'responses';
const ResultService = require("../services/result.service");
const SubmissionService = require("../services/submission.service");
const SseServer = require("../sse/SseServer");
const Point = require("../enum/Point");

class Publisher {
    static instance = null;
    channel = null;
    queue = null;
    callback_queue = null;
    exchange = null;

    constructor() {
    }

    setChannel(channel) {
        this.channel = channel;
    }

    setExchange(exchange) {
        this.exchange = exchange;
    }

    setQueue(queue) {
        this.queue = queue;
    }

    setCallbackQueue(callback_queue) {
        this.callback_queue = callback_queue;
    }

    generateUuid() {
        return Math.random().toString() +
            Math.random().toString() +
            Math.random().toString();
    }

    async init() {
        try {
            const connection = await amqp.connect(process.env.AMQP_URI);
            const judgeChannel = await connection.createChannel();
            this.setChannel(judgeChannel);

            const exchange = await judgeChannel.assertExchange(EXCHANGE, "direct", { durable: true });
            this.setExchange(exchange);

            const queue = await judgeChannel.assertQueue(QUEUE, { duration: true });
            this.setQueue(queue);

            const responseQueue = await judgeChannel.assertQueue(RESPONSE_QUEUE, { duration: true });
            this.setCallbackQueue(responseQueue);

            judgeChannel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

            console.log(`Exchange, queue and callback_queue established connection successfully!`);
        }
        catch (e) {
            console.log("Error when init publisher", e);
        }

    }

    pushJob(job) {
        try {
            this.channel.publish(EXCHANGE, ROUTING_KEY, Buffer.from(JSON.stringify(job)), {
                replyTo: RESPONSE_QUEUE
            });
            this.channel.consume(RESPONSE_QUEUE, async (msg) => {
                const responseString = msg.content.toString();
                const responseObject = JSON.parse(responseString);
                const resultPromise = ResultService.createResults(responseObject);
                let submissionPromise = Promise.resolve();
                let verdict = null;
                let submissionId = null;
                let time = null;
                let memory = null;
                if (responseObject.length) {
                    const result = responseObject[responseObject.length - 1];
                    if (result.submission_id) {
                        submissionPromise = SubmissionService.update(result.submission_id, {
                            verdict: result.verdict,
                            time: result?.time ? Math.floor(result.time / 1000000) : Point.MAX_TIME_LIMIT,
                            memory: result?.memory ? Math.floor(result.memory / 1024) : Point.MAX_MEMORY_LIMIT
                        })
                    }
                    verdict = result.verdict;
                    submissionId = result.submission_id;
                    time = result?.time ? Math.floor(result.time / 1000000) : Point.MAX_TIME_LIMIT;
                    memory = result?.memory ? Math.floor(result.memory / 1024) : Point.MAX_MEMORY_LIMIT;
                }
                await Promise.all([resultPromise, submissionPromise]);
                const server = SseServer.getInstance();
                if (submissionId) {
                    server.sendEvent(submissionId.toString(), verdict, time, memory)
                }
                this.channel.ack(msg);
            }, { noAck: false })
        }
        catch (e) {
            console.log("Error when push job", e.message);
        }
    }

    static getInstance() {
        if (!Publisher.instance) {
            Publisher.instance = new Publisher();
        }
        return Publisher.instance;
    }
}

module.exports = Publisher;