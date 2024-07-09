
require('dotenv').config();
const amqp = require('amqplib');
const EXCHANGE = "direct_rankings";
const QUEUE = 'rankings';
const ROUTING_KEY = 'task_ranking';

class Publisher {
    static instance = null;
    channel = null;
    queue = null;
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

    async init() {
        try {
            const connection = await amqp.connect(process.env.AMQP_URI);
            const judgeChannel = await connection.createChannel();
            this.setChannel(judgeChannel);

            const exchange = await judgeChannel.assertExchange(EXCHANGE, "direct", { durable: true });
            this.setExchange(exchange);

            const queue = await judgeChannel.assertQueue(QUEUE, { duration: true });
            this.setQueue(queue);

            judgeChannel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

            console.log(`Exchange, queue established connection successfully!`);
        }
        catch (e) {
            console.log("Error when init publisher", e);
        }

    }

    pushJob(job) {
        try {
            this.channel.publish(EXCHANGE, ROUTING_KEY, Buffer.from(JSON.stringify(job)));
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