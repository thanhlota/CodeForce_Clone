require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const route = require("./routes");

app.use(cors({
    origin: ['http://localhost:3000','http://192.168.172.82:3000'],
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
    res.json({ message: "Hello World!" });
});

app.listen(port, () => console.log(`listening on port ${port}`));

app.use('/api', route);