const ContestController = require("../controllers/contest.controller.js");
const express = require('express');
const ContestRouter = express.Router();

ContestRouter.post(
    "/create", ContestController.create
);

ContestRouter.delete(
    "/remove", ContestController.remove
)

ContestRouter.patch(
    "/update", ContestController.update
)

ContestRouter.get(
    "/all", ContestRouter.getContestsWithFilter
)

ContestRouter.get(
    "/:id", ContestRouter.getContestById
)

module.exports = UserRouter;
