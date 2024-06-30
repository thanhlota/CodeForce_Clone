require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
// const route = require("./routes");
const Consumer = require("./queues/consumer");
const client = require("./redisClient");

app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.172.82:3000'],
    allowMethods: ["GET", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"],
    allowHeaders: [
        "DNT",
        "User-Agent",
        "X-Requested-With",
        "If-Modified-Since",
        "Cache-Control",
        "Content-Type",
        "Range",
        "authentication",
        "Authorization"
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.HOST_PORT || 6000;

app.get("/", (req, res) => {
    res.json({ message: "Hello World123!" });
});

app.listen(port, () => console.log(`listening on port ${port}`));

// app.use('/api', route);
(async (
) => {
    const consumer = Consumer.getInstance();
    await consumer.init();
    consumer.receiveJob();
})();

app.get('/contest-ranking/:contest_id', async (req, res) => {
    const { contest_id } = req.params;

    // Lấy danh sách user_id từ sorted set
    const user_ids = await client.zRange(`contest:${contest_id}:rankings`, 0, -1);

    // Chuẩn bị kết quả
    const results = [];

    // Duyệt qua từng user_id để lấy thông tin chi tiết
    for (const user_id of user_ids) {
        const user_name = await client.hGet(`user:${user_id}:details`, 'user_name');
        const problems = await client.zRange(`contest:${contest_id}:user:${user_id}:problems`, 0, -1, 'WITHSCORES');

        // Format và thêm thông tin vào kết quả
        const user_result = {
            user_id,
            user_name,
            problems: {}
        };

        for (let i = 0; i < problems.length; i += 2) {
            const [problem_verdict, verdict] = problems[i].split(':');
            user_result.problems[problem_verdict] = verdict;
        }

        results.push(user_result);
    }

    res.json(results);
});