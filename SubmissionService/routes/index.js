const express = require('express');
const CombineRouter = express.Router();

const SubmissionRoute = require("./submission.route");

CombineRouter.use('/submission', SubmissionRoute);

module.exports = CombineRouter;