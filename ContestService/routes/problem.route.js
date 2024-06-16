const ProblemController = require("../controllers/problem.controller.js");
const express = require('express');
const ProblemRouter = express.Router();
const { verifyAdmin } = require("../middlewares/auth.js");

ProblemRouter.post(
    "/admin/create", verifyAdmin, ProblemController.create
);

ProblemRouter.delete(
    "/admin/remove/:id", verifyAdmin,ProblemController.remove
)

ProblemRouter.put(
    "/admin/update/:id", verifyAdmin,ProblemController.update
)

ProblemRouter.get(
    "/all", ProblemController.getProblems
)

ProblemRouter.get(
    "/:id", ProblemController.getProblemById
)

module.exports = ProblemRouter;
