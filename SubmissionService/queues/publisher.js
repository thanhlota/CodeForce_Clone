
require('dotenv').config();
const amqp = require('amqplib');
const EXCHANGE = "direct_jobs";
const QUEUE = 'jobs';
const ROUTING_KEY = 'task_queue';
const RESPONSE_QUEUE = 'responses';

class Publisher {
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

    async pushJob(job) {
        try {
            this.channel.publish(EXCHANGE, ROUTING_KEY, Buffer.from(job.toString()), {
                replyTo: RESPONSE_QUEUE
            });
            console.log(' [x] Requesting fib(%d)', job);
            this.channel.consume(RESPONSE_QUEUE, (msg) => {
                console.log(' [.] Got %s', msg.content.toString());
                this.channel.ack(msg);
            }, { noAck: false })
        }
        catch (e) {
            console.log("Error when push job", e.message);
        }
    }
}

module.exports = Publisher;