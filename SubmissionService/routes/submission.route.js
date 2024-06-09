const SubmissionController = require("../controllers/submission.controller.js");
const express = require('express');
const SubmissionRouter = express.Router();

SubmissionRouter.post("/submit", SubmissionController.create);
SubmissionRouter.get("/all", SubmissionController.getSubmissions);
SubmissionRouter.get("/:id", SubmissionController.getById);


module.exports = SubmissionRouter;