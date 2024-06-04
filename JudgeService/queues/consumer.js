
require('dotenv').config();
const amqp = require('amqplib');
const QUEUE = 'jobs';
function fibonacci(n) {
    if (n === 0 || n === 1)
        return n;
    else
        return fibonacci(n - 1) + fibonacci(n - 2);
}

class Consumer {
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

            judgeChannel.prefetch(1);
            console.log(' [x] Awaiting RPC requests');
        }
        catch (e) {
            console.log("Error when init consumer", e.message);
        }
    }

    async receiveJob() {
        try {
            this.channel.consume(QUEUE, (msg) => {
                var n = parseInt(msg.content.toString());
                var r = fibonacci(n);
                this.channel.sendToQueue(msg.properties.replyTo,
                    Buffer.from(r.toString())
                )
                this.channel.ack(msg);
            }, { noAck: false })
        }
        catch (e) {
            console.log("Error when receive job", e.message);
        }
    }
}

module.exports = Consumer;