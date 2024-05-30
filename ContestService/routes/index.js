const express = require('express');
const CombineRouter = express.Router();


const contestRoute = require('./contest.route');
const problemRoute = require('./problem.route');
// const testcaseRoute = require('./testcase.route');

CombineRouter.use('/contest', contestRoute);
CombineRouter.use('/problem', problemRoute);
// CombineRouter.use('/testcase', testcaseRoute);x

module.exports = CombineRouter;