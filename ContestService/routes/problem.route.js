const ProblemController = require("../controllers/problem.controller.js");
const express = require('express');
const ProblemRouter = express.Router();

ProblemRouter.post(
    "/admin/create", ProblemController.create
);

ProblemRouter.delete(
    "/admin/remove/:id", ProblemController.remove
)

ProblemRouter.put(
    "/admin/update/:id", ProblemController.update
)

ProblemRouter.get(
    "/all", ProblemController.getProblems
)

ProblemRouter.get(
    "/:id", ProblemController.getProblemById
)

module.exports = ProblemRouter;
