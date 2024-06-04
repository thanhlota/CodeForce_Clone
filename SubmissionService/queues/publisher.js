
require('dotenv').config();
const amqp = require('amqplib');
const EXCHANGE = "direct_jobs";
const QUEUE = 'jobs';
const ROUTING_KEY = 'task_queue';
const RESPONSE_QUEUE = 'responses';
const ResultService = require("../services/result.service");
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
            console.log("Error when init publisher", e.message);
        }

    }

    pushJob(job) {
        try {
            this.channel.publish(EXCHANGE, ROUTING_KEY, Buffer.from(JSON.stringify(job)), {
                replyTo: RESPONSE_QUEUE
            });
            this.channel.consume(RESPONSE_QUEUE, (msg) => {
                const responseString = msg.content.toString();
                const responseObject = JSON.parse(responseString);
                this.channel.ack(msg);
                ResultService.createResults(responseObject);
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