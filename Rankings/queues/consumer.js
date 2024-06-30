
require('dotenv').config();
const amqp = require('amqplib');
const QUEUE = 'rankings';
const client = require('../redisClient');

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
                // Lưu thông tin user_name
                await client.hSet(`user:${user_id}:details`, 'user_name', user_name);

                // Lưu verdict của từng problem_id và contest_id
                await client.hSet(`user:${user_id}:details`, `verdict:${contest_id}:${problem_id}`, verdict);

                // Kiểm tra xem user đã accept code với problem_id trước đó hay chưa
                const previousVerdict = await client.hGet(`contest:${contest_id}:user:${user_id}:problem:${problem_id}`, 'verdict');
                if (previousVerdict === 'accept') {
                    res.send('User has already accepted the problem, score not added.');
                } else {
                    // Cộng score cho user
                    if (verdict === 'accept') {
                        await client.zIncrBy(`contest:${contest_id}:rankings`, 10, user_id); // Giả sử mỗi lần accept được cộng 10 điểm
                    }

                    // Cập nhật kết quả cho problem
                    await client.hSet(`contest:${contest_id}:user:${user_id}:problem:${problem_id}`, 'verdict', verdict);

                    this.channel.ack(msg);
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