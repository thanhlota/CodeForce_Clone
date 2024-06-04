require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const route = require("./routes");
const Publisher = require("./queues/publisher");

app.use(cors({
    origin: '*',
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
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.HOST_PORT || 6000;

app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});

app.listen(port, () => console.log(`listening on port ${port}`));

app.use('/api', route);

const publisher = new Publisher(); 
await publisher.init();
const jobs = [1, 2];
for (let i = 0; i < jobs.length; i++) {
    publisher.pushJob(jobs[i]);
}