const ContestController = require("../controllers/contest.controller.js");
const express = require('express');
const ContestRouter = express.Router();
const { verifyAdmin, verifyUser } = require("../middlewares/auth.js");

ContestRouter.post(
    "/admin/create", verifyAdmin, ContestController.create
);

ContestRouter.delete(
    "/admin/remove/:id", verifyAdmin, ContestController.remove
)

ContestRouter.put(
    "/admin/update/:id", verifyAdmin, ContestController.update
)

ContestRouter.get(
    "/all", ContestController.getContests
)

ContestRouter.get(
    "/:id", ContestController.getContestById
)

ContestRouter.post(
    "/register", verifyUser, ContestController.registerContest
)

ContestRouter.post(
    "/unregister", verifyUser, ContestController.unregisterContest
)

module.exports = ContestRouter;
