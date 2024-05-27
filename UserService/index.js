require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const route = require("./routes/index.js");

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

app.listen(port, () => console.log(`listening on port ${port}`));

app.use('api', route);