const express = require('express');
const CombineRouter = express.Router();
const rankingRoute = require('./ranking.route');

CombineRouter.use('/ranking', rankingRoute);

module.exports = CombineRouter;