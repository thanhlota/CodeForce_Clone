const express = require('express');
const CombineRouter = express.Router();


const userRoute = require('./user.route');
CombineRouter.use('/user', userRoute);

module.exports = CombineRouter;