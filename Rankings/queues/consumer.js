
require('dotenv').config();
const amqp = require('amqplib');
const QUEUE = 'rankings';
const client = require('../redisClient');
const rankingService = require("../services/ranking.service");

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

            console.log(' [x] Awaiting RPC requests');
        }
        catch (e) {
            console.log("Error when init consumer", e);
        }
    }

    async receiveJob() {
        try {
            this.channel.consume(QUEUE, async (msg) => {
                const jobString = msg.content.toString();
                const jobObject = JSON.parse(jobString);

                const { user_id, user_name, contest_id, problem_id, verdict } = jobObject;
                if (!user_id || !user_name || !contest_id || !problem_id || !verdict) {
                    this.channel.nack(msg, false, false);
                }
                console.log('newJob', jobObject);
                await rankingService.updateRedisRanking(
                    user_id,
                    user_name,
                    contest_id,
                    problem_id,
                    verdict
                );
                this.channel.ack(msg);
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