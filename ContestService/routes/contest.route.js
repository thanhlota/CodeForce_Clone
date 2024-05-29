const ContestController = require("../controllers/contest.controller.js");
const express = require('express');
const ContestRouter = express.Router();

ContestRouter.post(
    "/admin/create", ContestController.create
);

ContestRouter.delete(
    "/admin/remove/:id", ContestController.remove
)

ContestRouter.put(
    "/admin/update/:id", ContestController.update
)

ContestRouter.get(
    "/all", ContestController.getContests
)

ContestRouter.get(
    "/:id", ContestController.getContestById
)

module.exports = ContestRouter;
